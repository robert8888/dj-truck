import React, { Fragment } from "react";
import { useAuth0 } from "./../../auth0/react-auth0-spa";
import "./profile.scss"

const Profile = () => {
  const { loading, user } = useAuth0();

  if (loading || !user) {
    return <div>Loading...</div>;
  }

  return (
    <Fragment>
      <div className="user-profile">
        <img src={user.picture} alt="Profile picture" />

        <h2>{user.name}</h2>
        <p>{user.email}</p>
        <code>{JSON.stringify(user, null, 2)}</code>
      </div>

    </Fragment>
  );
};

export default Profile;