import React, { useCallback } from "react";
import { connect } from "react-redux";
import UserProfile from "../common/components/UserProfile/UserProfile";
import { reqUpdateDescription, reqUpdateNickname, reqUpdatePicture } from "actions";
import { useAuth0 } from "auth0/react-auth0-spa";
import "./profile.scss";
import {Container} from "react-bootstrap";

const Profile = ({
  nickname,
  updatePicture,
  updateNickname,
  updateDescription,
}) => {
  const { loading, user } = useAuth0();

  const profileDataChange = useCallback((type, data)=>{
    switch(type){
      case "picture": {
        updatePicture(data);
        break;
      }
      case "nickname": {
        updateNickname(data);
        break;
      }
      case "description":{
        updateDescription(data);
        break;
      }
      default: return;
    }
  },[
    updateDescription,
    updateNickname,
    updatePicture
  ])

  if (loading || !user) {
    return <div>Loading...</div>;
  }

  if(!nickname){
    return null;
  }

  return (
      <Container className="app layout container-xl" >
        <UserProfile nickname={nickname} editable onChange={profileDataChange}/>
      </Container>
  );
};
const mapStateToProps = state => ({
  nickname : state.user.nickname,
})

const mapDispatchToProps = dispatch => ({
  updatePicture : (blob) => dispatch(reqUpdatePicture(blob)),
  updateNickname : (nickname) => dispatch(reqUpdateNickname(nickname)),
  updateDescription: (description) => dispatch(reqUpdateDescription(description))
})

export default connect(mapStateToProps, mapDispatchToProps)(Profile);