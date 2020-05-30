import queryString from "query-string";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { connect } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { reqRecs, setFooterType } from "./../../actions";
import { useAuth0 } from "./../../auth0/react-auth0-spa";
import Pagin from "./../common/components/Pagin/Pagin";
import PlayerControls from "./../common/components/PlayerControls/PlayerControls";
import RecordsList from "./../common/components/RecordList/RecordList";
import RecordSearch from "./../common/components/RecordSearch/RecordSearch";
import UserProfile from "./../common/components/UserProfile/UserProfile";
import { useRecordPlayer } from "./../common/Hooks/useRecordPlayer";
import useRecordSearchUrl from "./../common/Hooks/useRecordSearchURL";
import "./user-records.scss";

const UserRecords = React.memo(({
    setFooter,
    requestList,
    userId,
    isCurrentUser,
   // searchQuery,
    recordsList,
    countAll }) => {
    ///-----------Turn of footer--------------------

    useEffect(() => {
        setFooter("player")
    }, [setFooter])
    //--------------------------------

    const [controls, player] = useRecordPlayer();
    //-------------------------
    const { loading, isAuthenticated } = useAuth0();
    const [pageTitle, setPageTitle] = useState("Records");
    const [displaySearch, setSearchDisplaing] = useState(false);
    const [getSerachUrl] = useRecordSearchUrl();
    const history = useHistory();
    const { user: nickname, generes } = useParams();


    const queryStr = useLocation().search;
    let { pageSize, page, preloaded, searchOpt, _generes , search:searchQuery} = useMemo(() => {
        const values = queryString.parse(queryStr)
        return {
            pageSize: +values.pageSize,
            page: +values.page,
            preloaded: values.preloaded,
            current: values.current,
            searchOpt: values.searchOpt,
            _generes: values.generes,
            search: values.search
        }
    }, [queryStr])

    const [_pageSize, setPageSize] = useState(20);
    const [_page, setPage] = useState(0);


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

        if (generes) {
            where.genereNames = generes.split(",");
        }
         
        if(_generes){
            where.genereNames = _generes.split(",")
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
        

        setSearchDisplaing(searchConsole);

        requestList(pgSize, pg, where);
        setPageSize(pgSize);
        setPage(pg)

    }, [userId,
        requestList,
        _pageSize,
        page,
        pageSize,
        preloaded,
        setPageTitle,
        searchQuery,
        generes,
        _generes,
        loading,
        isAuthenticated,
        isCurrentUser,
        nickname,
        searchOpt,
        recordsList.length,
    ])

    const getNextPageUrl = useCallback((page, pageSize) => {
        let url = window.location.pathname;
        url += '?pageSize=' + pageSize;
        url += '&page=' + page;
        let search = window.location.search;
        search = search.replace(/pageSize=\d+/, '');
        search = search.replace(/&page=\d+/, '');
        search = search.replace('?', '&');
        url += search;
        url = url.replace(/&{2,}/g, "&");
        return url;
    }, [])

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
        const url = getSerachUrl(queryStr, {
            searchOpt,
            searchParams: { generes: [generes, _generes] }
        })

        history.push(url);
    }, [history, getSerachUrl, _generes, generes])

    
    return (
        <div className="user-records">
            {nickname && <UserProfile nickname={nickname} withGeneres/>}
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

            <RecordsList
                list={recordsList}
                controls={controls}
                player={player} />
            <Pagin
                current={_page}
                call={goToPage}
                all={Math.floor(countAll / _pageSize)} />
            <PlayerControls
                list={recordsList}
                controls={controls}
                player={player} />
        </div>
    )
    


})

const mapStateToProps = state => ({
    recordsList: state.records.list,
    countAll: state.records.countAll,
    userId: state.user.dbId,
    userNickname: state.user.nickname,
})

const mapDispatchToProps = dispatch => ({
    requestList: (pageSize, page, where) => dispatch(reqRecs(pageSize, page, where)),
    setFooter : (type) => dispatch(setFooterType(type))
})

export default connect(mapStateToProps, mapDispatchToProps)(UserRecords)
