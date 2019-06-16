import React, { Component } from "react";
import { get, put, del, post } from "../services/axios";
import "../styling/Vacancies.css";
import decode from "jwt-decode";
//import storageChanged from "storage-changed";
import VacanciesList from "../components/vacancies/List.js";
import {
  Header,
  Dimmer,
  Loader,
  Icon,
  Input,
  Divider,
  Message,
  Transition,
  Confirm
} from "semantic-ui-react";
import { connect } from "react-redux";

class Vacancies extends Component {
  state = {
    vacancies: [],
    error: false,
    loading: true,
    searchBar: "",
    adminType: false,
    openConfirm: false,
    deletedId: "",
    memberType: false,
    filteredVacancies: [],
    pendingCount: 0,
    partnerId: "",
    approveLoading: false
  };
  changeSearchBar = e => {
    this.setState({ searchBar: e.target.value });
  };

  componentDidMount() {
    get("vacancies")
      .then(response => {
        const { userInfo } = this.props;
        let adminType = false;
        let memberType = false;
        let memberId = "";
        if (userInfo) {
          if (userInfo.type === "admin") adminType = true;
          if (userInfo.type === "member") {
            memberType = true;
            memberId = userInfo.id;
          }
        }
        this.setState({
          vacancies: response,
          loading: false,
          userInfo,
          adminType,
          memberType,
          memberId
        });
        this.setData(response, adminType);
      })
      .catch(error => this.setState({ error: true, loading: false }));
  }
  componentWillReceiveProps(nextProps) {
    const { userInfo, vacancies } = this.state;
    let adminType = false;
    if (nextProps.userInfo !== userInfo) {
      if (nextProps.userInfo) {
        if (nextProps.userInfo.type === "admin") {
          adminType = true;
          this.setData(vacancies, true);
        } else {
          this.setData(vacancies, false);
        }
      } else {
        this.setData(vacancies, false);
      }
      this.setState({ userInfo: nextProps.userInfo });
    }

    this.setState({ adminType });
  }
  setApproved = (id, pid) => {
    const { adminType, filteredVacancies } = this.state;

    let newFilteredVacancies = filteredVacancies.map(vacancy => {
      if (vacancy._id === id) {
        return { ...vacancy, state: "free" };
      } else {
        return vacancy;
      }
    });
    let approvedVacancy = newFilteredVacancies.find(
      vacancy => vacancy._id === id
    );

    approvedVacancy = { ...approvedVacancy, state: "free" };
    const url = "vacancies/update/" + id;

    const data = {
      ...approvedVacancy,
      partnerId: pid
    };
    const { _id, partner, __v, ...newData } = data;
    put(url, newData).then(() => {
      this.setData(newFilteredVacancies, true);
      this.setState({ approveLoading: false });
      const notifUrl = `subscribers/send`;
      const req = {
        userIds: [pid],
        data: {
          title: "Vacancy Approval!",
          body: `Members can now view and apply on ${
            approvedVacancy.title ? approvedVacancy.title : "your vacancy"
          }`,
          link: "/Vacancies",
          actionTitle: "Visit",
          img:
            "https://cdn.pixabay.com/photo/2016/03/31/14/37/check-mark-1292787__340.png"
        }
      };
      post(notifUrl, req).then(resp => console.log(resp));
    });
  };
  delete = deletedId => {
    // const { deletedId } = this.state;
    let { vacancies } = this.state;
    const vacancyIndex = vacancies.findIndex(
      vacancy => vacancy._id === deletedId
    );
    const deleted = vacancies[vacancyIndex];
    vacancies.splice(vacancyIndex, 1);
    this.setState({ vacancies });
    this.setData(vacancies, true);
    const url = "vacancies/delete/" + deletedId;
    del(url, {}).then(() => {
      this.setState({ openConfirm: false });
      const notifUrl = `subscribers/send`;
      const req = {
        userIds: [deleted.partner._id],
        data: {
          title: "Your vacancy has been deleted!",
          body: `Members can no longer view and apply on ${
            deleted.title ? deleted.title : "your vacancy"
          }`,
          link: "/Vacancies",
          actionTitle: "Visit",
          img:
            "https://cdn2.iconfinder.com/data/icons/e-business-helper/240/627249-delete3-512.png"
        }
      };
      post(notifUrl, req).then(resp => console.log(resp));
    });
  };

  setData = (vacancies, adminType) => {
    if (vacancies.length === 0) return;
    let pendingCount = 0;
    const filteredVacancies = [];
    vacancies.forEach(vacancy => {
      if (vacancy.state === "free" || vacancy.state === "taken" || adminType) {
        if (vacancy.state === "unapproved" || vacancy.state === "Not taken")
          pendingCount++;
        filteredVacancies.push(vacancy);
      }
    });
    this.setState({ filteredVacancies, pendingCount });
  };
  redirect = id => {
    this.props.history.push("/Vacancy/" + id);
  };
  search = vacancies => {
    const { searchBar } = this.state;
    if (searchBar.length === 0) return vacancies;
    const keys = searchBar.split(" ");
    const filteredArray = [];
    const searchProps = ["title", "location", "description"];
    vacancies.forEach(vac => {
      keys.forEach(key => {
        if (vac.partner.name.toUpperCase().includes(key.toUpperCase())) {
          if (vac.matchCount) vac.matchCount++;
          else vac.matchCount = 1;
        }
        if (vac.skills) {
          const skills = vac.skills.forEach(skill => {
            if (skill.toUpperCase().includes(key.toUpperCase())) {
              if (vac.matchCount) vac.matchCount++;
              else vac.matchCount = 1;
            }
          });
        }
        searchProps.forEach(prop => {
          const value = vac[prop];
          if (value) {
            if (value.toUpperCase().includes(key.toUpperCase())) {
              if (vac.matchCount) vac.matchCount++;
              else vac.matchCount = 1;
            }
          }
        });
      });
      if (vac.matchCount) filteredArray.push(vac);
    });
    return filteredArray
      .sort((a, b) => b.matchCount - a.matchCount)
      .map(obj => {
        delete obj.matchCount;
        return obj;
      });
  };

  render() {
    const {
      filteredVacancies,
      error,
      loading,
      searchBar,
      adminType,
      memberId,
      openConfirm,
      approveLoading,
      memberType,
      pendingCount
    } = this.state;
    const searchedVacancies = this.search(filteredVacancies);
    return (
      <div className="vacancy-container">
        <Dimmer active={loading}>
          <Loader size="massive" />
        </Dimmer>
        <Header as="h1" textAlign="center">
          <Icon name="wpforms" className="vacancies-icon" />
          Vacancies
          <Header.Subheader>
            Perfectly curated for your needs
            <Divider hidden />
            <Input
              placeholder="Search using any field"
              size="mini"
              icon="search"
              onChange={this.changeSearchBar}
              value={searchBar}
            />
            <Divider hidden fitted />
            <Message
              compact
              style={{ maxWidth: "20em" }}
              error
              hidden={searchedVacancies.length > 0 || loading}
              icon
            >
              {" "}
              <Icon size="mini" name="search" />
              No results found for {searchBar}
            </Message>
          </Header.Subheader>
        </Header>
        <Transition.Group duration={400}>
          {searchedVacancies.map(vacancy => (
            <div key={vacancy._id}>
              <VacanciesList
                error={error}
                searchKey={searchBar}
                vacancy={vacancy}
                memberType={memberType}
                memberId={memberId}
                approve={this.setApproved}
                adminType={adminType}
                del={this.delete}
                pendingCount={pendingCount}
                approveLoading={approveLoading}
                redirect={this.redirect}
              />
            </div>
          ))}
        </Transition.Group>
      </div>
    );
  }
}
const mapStateToProps = state => {
  const { userInfo } = state;
  return { userInfo };
};

export default connect(mapStateToProps)(Vacancies);
