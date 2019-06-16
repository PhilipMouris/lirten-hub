import React, { Component } from "react";
import {
  Segment,
  Header,
  Icon,
  Message,
  Input,
  Transition
} from "semantic-ui-react";
import "../../styling/PartnerProfile.css";
import JobAppsModal from "./JobAppsModal";
import { get, del } from "../../services/axios";
import VacanciesList from "../vacancies/List";
import { withRouter } from "react-router-dom";

class VacancySegment extends Component {
  state = {
    loading: true,
    error: false,
    searchBar: "",
    deletedId: "",
    editedId: "",
    jobApplicationId: "",
    openJobAppModal: false
  };
  componentDidMount() {
    const { id } = this.props;
    const url = "vacancies/partnerVacancies/" + id;
    get(url)
      .then(vacancies => {
        this.setState({
          vacancyCount: vacancies.length,
          vacancies,
          loading: false,
          error: false
        });
      })
      .catch(error => {
        this.setState({ loading: false, error: true });
      });
  }
  changeSearchBar = e => {
    this.setState({ searchBar: e.target.value });
  };

  search = vacancies => {
    const { searchBar } = this.state;
    const { myProfile, admin } = this.props;
    if (!vacancies) return vacancies;
    if (searchBar.length === 0) {
      if (myProfile || admin) return vacancies;
      else return vacancies.filter(vac => vac.state !== "unapproved");
    }
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
    const result = filteredArray
      .sort((a, b) => b.matchCount - a.matchCount)
      .map(obj => {
        delete obj.matchCount;
        return obj;
      });
    if (myProfile || admin) return result;
    else {
      return result.filter(vac => vac.state !== "unapproved");
    }
  };
  delete = id => {
    this.setState({ deleteLoading: true, deletedId: id });
    const { vacancies, vacancyCount } = this.state;
    const url = `vacancies/delete/${id}`;
    del(url, {})
      .then(resp => {
        const deletedIndex = vacancies.findIndex(vac => vac._id === id);
        vacancies.splice(deletedIndex, 1);
        this.setState({ vacancies, vacancyCount: vacancyCount - 1 });
      })
      .catch(err => {
        this.setState({ loading: false, error: true });
      });
  };
  editVacancy = vacancy => {
    const { id, partner } = this.props;
    this.props.history.push({
      pathname: `/EditVacancy/${id}`,
      state: { vacancy, partner }
    });
  };
  viewJobApplications = (jobApplicationId, vacancyApprove) => {
    this.setState({ jobApplicationId, openJobAppModal: true, vacancyApprove });
  };
  closeJobApplications = () => {
    this.setState({ openJobAppModal: false });
  };
  setTaken = _id => {
    const { vacancies } = this.state;
    const index = vacancies.findIndex(vac => vac._id === _id);
    vacancies[index].state = "taken";
    this.setState({ vacancies });
  };

  render() {
    const {
      loading,
      vacancies,
      error,
      searchBar,
      deletedId,
      jobApplicationId,
      openJobAppModal,
      vacancyApprove
    } = this.state;
    const filteredVacancies = this.search(vacancies);
    let vacancyCount = 0;
    if (filteredVacancies) vacancyCount = filteredVacancies.length;
    else {
      vacancyCount = 0;
    }
    const { id, myProfile } = this.props;
    return (
      <Segment id="vacancy-segment" loading={loading} padded>
        <JobAppsModal
          setTaken={this.setTaken}
          vacancy={vacancyApprove}
          vacancyId={jobApplicationId}
          open={openJobAppModal}
          onClose={this.closeJobApplications}
          partnerId={id}
        />
        <Message className="error-message" compact error hidden={!error} icon>
          <Icon size="mini" name="times circle" />
          Something went wrong !
        </Message>
        <Header as="h1" textAlign="center">
          {myProfile ? "My Vacancies" : "Vacancies"}
          {vacancyCount >= 0 ? ` (${vacancyCount})` : ""}
        </Header>
        {vacancies ? (
          <div>
            <Header textAlign="center">
              <Input
                onChange={this.changeSearchBar}
                size="mini"
                icon="search"
                placeholder="search using any field"
              />
            </Header>
            <Header textAlign="center">
              <Message info compact hidden={filteredVacancies.length > 0}>
                No vacancies found
              </Message>
            </Header>
            <Transition.Group duration={400}>
              {filteredVacancies.map(vacancy => (
                <div key={vacancy._id}>
                  <VacanciesList
                    viewJobApplications={this.viewJobApplications}
                    edit={this.editVacancy}
                    deletedId={deletedId}
                    del={this.delete}
                    fromPartner={myProfile}
                    error={error}
                    searchKey={searchBar}
                    vacancy={vacancy}
                  />
                </div>
              ))}
            </Transition.Group>
          </div>
        ) : null}
      </Segment>
    );
  }
}
export default withRouter(VacancySegment);
