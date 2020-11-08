import queryString from "query-string";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {Container, Dropdown, DropdownButton} from "react-bootstrap";
import { connect } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";
import {loadRecords, reqRecs, setFooterType} from "./../../actions";
import { useAuth0 } from "./../../auth0/react-auth0-spa";
import Pagin from "./../common/components/Pagin/Pagin";
import PlayerControls from "./../common/components/PlayerControls/PlayerControls";
import RecordsList from "./../common/components/RecordList/RecordList";
import RecordSearch from "./../common/components/RecordSearch/RecordSearch";
import UserProfile from "./../common/components/UserProfile/UserProfile";
import { usePlayer } from "./../common/Hooks/usePlayer";
import useRecordSearchUrl from "./../common/Hooks/useRecordSearchURL";
import "./user-records.scss";
import useNextPageUrl from "../../reducers/records/useNextPageUrl";
import useFetchRecordList from "../common/Hooks/useFetchRecordList";
import useDynamicFooter from "../common/Hooks/useDynamicFooter";
import ErrorBoundary from "../common/components/ErrorBoundary/ErrorBoundary";

const UserRecords = React.memo(({userId, isCurrentUser,}) => {
    const [controls, player] = usePlayer();
    const {loading, isAuthenticated } = useAuth0();
    const [getSearchUrl] = useRecordSearchUrl();
    const getNextPageUrl = useNextPageUrl();
    const [setFooter] = useDynamicFooter();
    const [{records: recordsList = [], countAll = 0}, fetchRecords] = useFetchRecordList();
    const history = useHistory();
    const { user: nickname, genres } = useParams();

    const [pageTitle, setPageTitle] = useState("Records");
    const [displaySearch, setSearchDisplaying] = useState(false);

    const [_pageSize, setPageSize] = useState(20);
    const [_page, setPage] = useState(0);

    useEffect(() => {
        setFooter("player")
    }, [setFooter])

    const queryStr = useLocation().search;
    let { pageSize, page, preloaded, searchOpt, _genres , search:searchQuery} = useMemo(() => {
        const values = queryString.parse(queryStr)
        return {
            pageSize: +values.pageSize,
            page: +values.page,
            preloaded: values.preloaded,
            current: values.current,
            searchOpt: values.searchOpt,
            _genres: values.genres,
            search: values.search
        }
    }, [queryStr])

    useEffect(() => {
        if ((preloaded && recordsList.length > 0) || loading) { return }

        if (isAuthenticated && !userId) { return }
        let pg = page || 0;
        let pgSize = pageSize || _pageSize;

        let searchConsole = true;

        const where = {};
        if (searchQuery) {
            where.query = searchQuery;
            if (searchOpt) {
                let opt = searchOpt.split(',');
                where.queryOpt = opt;
            }
            setPageTitle("Search: " + searchQuery)

        }

        if (genres) {
            where.genreNames = genres.split(",");
        }
         
        if(_genres){
            where.genreNames = _genres.split(",")
        }

        if (nickname) {
            where.nickname = nickname;
            setPageTitle(nickname + " user records")
            searchConsole = false;
        } else if (userId && isCurrentUser) {
            where.userId = userId;
            setPageTitle("Your records")
            searchConsole = false;
        }
        

        setSearchDisplaying(searchConsole);

        fetchRecords(pgSize, pg, where)
        setPageSize(pgSize);
        setPage(pg)

    }, [userId,
        fetchRecords,
        _pageSize,
        page,
        pageSize,
        preloaded,
        setPageTitle,
        searchQuery,
        genres,
        _genres,
        loading,
        isAuthenticated,
        isCurrentUser,
        nickname,
        searchOpt,
        recordsList.length,
    ])


    const changePageSize = useCallback((pageSize) => {
        history.push(getNextPageUrl(_page, pageSize));
    }, [history, _page, getNextPageUrl])

    const goToPage = useCallback((page) => {
        history.push(getNextPageUrl(page, _pageSize))
    }, [history, _pageSize, getNextPageUrl])

    const onSearch = useCallback((queryStr, searchOpt) => {
        if(!queryStr){
            history.push("/records")
        }
        const url = getSearchUrl(queryStr, {
            searchOpt,
            searchParams: { genres: [genres, _genres] }
        })

        history.push(url);
    }, [history, getSearchUrl, _genres, genres])


    return (
        <Container className="app layout container-xl" >
            <div className="user-records">
                <ErrorBoundary>
                    {nickname && <UserProfile nickname={nickname} withGenres/> || null}
                </ErrorBoundary>
                {displaySearch && <RecordSearch title="Dj Truck Records" onSearch={onSearch} />}
                <div className="user-records-top-bar">
                    <h2 className="title">{pageTitle}</h2>
                    <DropdownButton
                        alignRight
                        className="btn-pagger"
                        title={_pageSize + " on page "}>
                        <Dropdown.Item onClick={changePageSize.bind(null, 10)}> 10 </Dropdown.Item>
                        <Dropdown.Item onClick={changePageSize.bind(null, 20)}> 20 </Dropdown.Item>
                        <Dropdown.Item onClick={changePageSize.bind(null, 30)}> 30 </Dropdown.Item>
                        <Dropdown.Item onClick={changePageSize.bind(null, 50)}> 50 </Dropdown.Item>
                        <Dropdown.Item onClick={changePageSize.bind(null, 75)}> 75 </Dropdown.Item>
                        <Dropdown.Item onClick={changePageSize.bind(null, 100)}> 100 </Dropdown.Item>
                    </DropdownButton>
                </div>
                <ErrorBoundary>
                    {countAll !== 0 && <RecordsList
                        list={recordsList}
                        controls={controls}
                        player={player} /> || null}
                </ErrorBoundary>
                <Pagin
                    current={_page}
                    call={goToPage}
                    all={Math.floor(countAll / _pageSize)} />
                <PlayerControls
                    list={recordsList}
                    controls={controls}
                    player={player} />
            </div>
        </Container>
    )
})

const mapStateToProps = state => ({
    userId: state.user.dbId,
    userNickname: state.user.nickname,
})

export default connect(mapStateToProps)(UserRecords)
