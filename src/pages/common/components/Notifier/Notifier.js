import React, {useState, useEffect} from "react";
import {connect} from "react-redux";
import {hideNotification as hideNotificationAction} from "../../../../actions/notifications/notifications";
import Notification from "./Notification";
import Portal from "./Portal";

const Notifier = ({hideNotification, notification}) =>{
      const [hidden, setHidden] = useState(true);
      const [data, setData] = useState({});

      useEffect(()=>{
          if(!notification){
            setHidden(true)
          } else {
            setHidden(false);
            setData(notification.data)
            if(notification.timeout === undefined) return;
            setTimeout(()=>{
                  hideNotification()
            }, notification.timeout)
          }
      }, [notification, setData, setHidden, hideNotification])

      return (
          <Portal>
              <Notification data={data} onClose={hideNotification} hidden={hidden}/>
          </Portal>
      )
}

const mapStateToProps = (state) => ({
      notification: state.notifier.current,
})

const mapDispatchToProps = (dispatch) => ({
      hideNotification: () => dispatch(hideNotificationAction())
})


export default connect(mapStateToProps, mapDispatchToProps)(Notifier);