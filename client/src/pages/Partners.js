import React, { Component } from "react";
import { get, put, del, post } from "../services/axios";
import Container from "../components/profileContainer/Container.js";
import { Dimmer, Loader, Confirm } from "semantic-ui-react";
import decode from "jwt-decode";
//import storageChanged from "storage-changed";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

class Partners extends Component {
  state = {
    loading: true,
    error: false,
    partners: [],
    filteredPartners: [],
    fieldofWorkFilters: [],
    adminType: false,
    pendingCount: 0,
    deletedId: "",
    openConfirm: false
  };
  componentDidMount() {
    get("users/partners")
      .then(partners => {
        const { userInfo } = this.props;
        this.setState({ userInfo });
        let adminType = false;
        if (userInfo) if (userInfo.type === "admin") adminType = true;
        this.setData(partners, adminType);
        this.setState({ partners, loading: false });
      })
      .catch(error => this.setState({ error: true, loading: false }));

    //handling token change
  }
  componentWillReceiveProps(nextProps) {
    const { userInfo, partners } = this.state;
    console.log(userInfo, nextProps.userInfo);
    if (nextProps.userInfo !== userInfo) {
      if (nextProps.userInfo) {
        if (nextProps.userInfo.type === "admin") this.setData(partners, true);
        else {
          this.setData(partners, false);
        }
      } else {
        this.setData(partners, false);
      }
      this.setState({ userInfo: nextProps.userInfo });
    }
  }

  setData = (partners, adminType) => {
    if (partners.length === 0) return;
    let pendingCount = 0;
    const filteredPartners = [];
    const fieldofWorkFilters = [];
    partners.forEach(partner => {
      if (partner.userData.approved || adminType) {
        if (!partner.userData.approved) pendingCount++;
        filteredPartners.push(partner);
      }
      const { fieldOfWork } = partner.userData;
      if (fieldOfWork) {
        if (!fieldofWorkFilters.includes(fieldOfWork))
          fieldofWorkFilters.push(fieldOfWork);
      }
    });
    this.setState({ fieldofWorkFilters, filteredPartners, pendingCount });
  };
  setApproved = id => {
    const { filteredPartners, adminType } = this.state;
    const approvedPartner = filteredPartners.find(
      partner => partner._id === id
    );
    const { name, email } = approvedPartner;
    const {
      address,
      fax,
      phone,
      partners,
      members,
      projects
    } = approvedPartner.userData;
    approvedPartner.userData.approved = true;
    let { fieldOfWork } = approvedPartner.userData;
    let { image } = approvedPartner;
    if (!image) image = "N/A";
    if (!fieldOfWork) fieldOfWork = "N/A";
    const url = "users/partners/update/" + id;
    const data = {
      name,
      email,
      address,
      fax,
      phone,
      partners,
      members,
      projects,
      fieldOfWork,
      approved: true,
      image
    };
    put(url, data).then(() => {
      this.setData(filteredPartners, true);
      const notifUrl = `subscribers/send`;
      const req = {
        userIds: [id],
        data: {
          title: "Welcome to LirtenHub",
          body: "You have been approved to join us as a partner",
          link: "/Partners",
          actionTitle: "Visit",
          img:
            "https://cdn.pixabay.com/photo/2016/03/31/14/37/check-mark-1292787__340.png"
        }
      };
      post(notifUrl, req).then(resp => console.log(resp));
    });
  };
  openConfirm = deletedId => {
    this.setState({ deletedId, openConfirm: true });
  };
  delete = () => {
    this.setState({ openConfirm: false });
    const { deletedId } = this.state;
    let { partners } = this.state;
    const partnerIndex = partners.findIndex(
      partner => partner._id === deletedId
    );
    partners.splice(partnerIndex, 1);
    this.setState({ partners });
    console.log(partners);
    this.setData(partners, true);
    const url = "users/delete/" + deletedId;
    del(url, {});
  };
  closeConfirm = () => {
    this.setState({ deletedId: "", openConfirm: false });
  };
  redirectProfile = (id, partner) => {
    this.props.history.push({
      pathname: "/Partner/" + id,
      state: { partner }
    });
  };

  render() {
    const {
      filteredPartners,
      loading,
      fieldofWorkFilters,
      pendingCount,
      openConfirm
    } = this.state;
    const { userInfo } = this.state;
    let adminType = false;
    if (userInfo) if (userInfo.type === "admin") adminType = true;
    return (
      <div>
        <Dimmer active={loading}>
          <Loader size="massive" />
        </Dimmer>
        <Container
          redirect={this.redirectProfile}
          del={this.openConfirm}
          approve={this.setApproved}
          adminType={adminType}
          pendingCount={pendingCount}
          loading={loading}
          pageTitle="Partners"
          pageSubHeader="Our trusted partners"
          data={filteredPartners}
          filterTitles={["Field", "Approved"]}
          filterValues={[fieldofWorkFilters, ["Yes", "No"]]}
        />
        <Confirm
          open={openConfirm}
          onCancel={this.closeConfirm}
          onConfirm={this.delete}
        />
      </div>
    );
  }
}
const mapStateToProps = state => {
  const { userInfo } = state;
  return { userInfo };
};
export default connect(mapStateToProps)(Partners);
