import React, { useCallback, useEffect } from "react";
import { connect } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import UUIDClass from "uuidjs";
import { reqUserProfile } from "./../../../../actions";
import { useFormatRelative } from "./../../Hooks/useFormatDate";
import Edit from "./Edit/Edit";
import "./user-profile.scss";

const UserProfile = ({ nickname, profile, reqProfile, withGenres, editable , onChange = ifEmpty => null }) => {
    const location = useLocation();
    const [formatRelative] = useFormatRelative();

    useEffect(() => {
        if ((nickname && !profile) || profile.user.nickname !== nickname) {
            reqProfile(nickname);
        }
    }, [nickname, profile, reqProfile])

    const parsePirctureUrl = useCallback((url) => {
        if (url.startsWith("https://platform-lookaside.fbsbx.com")) {
            const asid = url.match(/asid=(?<asid>\d+)/).groups.asid;
            url = `https://graph.facebook.com/v2.5/${asid}/picture?type=large`
        }
        return url
    }, [])

    const linkToGenre = useCallback((genre)=>{
        let {pathname, search} = location;
        search = search.replace(/\??&?genres=[^&]+/g, "")
        return pathname + search + ((search) ? "&" : "?") + "genres=" + genre;
    },[location])

    if (!profile || !nickname) {
        return null;
    }

    return (
        <div className="user-profile">
            <main>
            <div className="user-picture">
                <Edit active={editable} type="image" onChange={onChange.bind(null, 'picture')}>
                    <img src={parsePirctureUrl(profile.user.picture)} alt="user avatar" />
                </Edit>
            </div>
            <section>
                <div className="user-nickname" >
                    <Edit active={editable} type="text" onChange={onChange.bind(null, 'nickname')} >
                        <h4>{profile.user.nickname}</h4>
                    </Edit>
                </div>
                <div className="user-joined">
                        <h5>{formatRelative(profile.user.createdAt, {timezone :true})}</h5>
                </div>
                <div className="user-record-stat">
                    <span>{`${profile.records} records`}</span>
                    <span>{`${~~(profile.recordsTime / (60 * 1000)) } min`}</span>
                </div>
            </section>
            </main>
            <aside>
            <div className="user-description">
                <Edit active={editable} type="textarea" onChange={onChange.bind(null, 'description')}>
                    <p>{profile.description}</p>
                </Edit>
            </div>
           {withGenres && 
           <div className="genres">
                    <ul>
                        {profile.genres && profile.genres.length &&
                            profile.genres.map( genreWrapper => (
                                <li key={UUIDClass.genV1()}>
                                    <Link to={linkToGenre(genreWrapper.genre.name)}>
                                        {`${genreWrapper.genre.name} - ${genreWrapper.occurrence}`}
                                    </Link>
                                </li>
                            ))
                        }
                    </ul>
            </div>	}
            </aside>

        </div>
    )
}

const mapStateToProps = state => ({
    profile: state.profile.current
})

const mapDispatchToProps = dispatch => ({
    reqProfile: (nickname) => dispatch(reqUserProfile(nickname))
})

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);

