/*
 Copyright (C) Appmobi
 Info: This document utilizes all the events for registering Appmobi events. Developers may change implementation of events.
 You can find the complete documentation here https://docs.appmobi.com/
 */

var pushMobi = function () {
    return {

        un: '',
        pwd: '',
        email: '',

    
        userName: '',
        passWord: '',


        /************************************
		Initialize plugin after device ready
		************************************/
        initializePlugin: function () {
            cordova.require("com.appMobiCloud.AppMobiCloud");
              var launchImageID = document.getElementById('launchImage');
            launchImageID.style.display = 'block';
            AppMobiCloud.plugin.initialize(function (data) {//success callback
                        alert("AppMobi library initialized successfully");
                        var launchImageID = document.getElementById("launchImage");
                        launchImageID.style.display = 'none';
            }, function (data) {//error callback
                        alert(data.message);
                        var launchImageID = document.getElementById("launchImage");
                        launchImageID.style.display = 'none';
            }, pushMobi.userName, pushMobi.passWord);




            /************************************
                    Setup Event Listeners
            ************************************/
            document.addEventListener('appMobi.notification.push.enable', pushMobi.pushEnabled, false);
            document.addEventListener('appMobi.notification.push.receive', pushMobi.pushReceive, false);
            document.addEventListener("appMobi.notification.push.disable", pushMobi.onPushNotificationEvent, false);
            document.addEventListener("appMobi.notification.push.sendpassword", pushMobi.onPushNotificationEvent, false);
            document.addEventListener("appMobi.notification.push.user.editattributes", pushMobi.onPushNotificationEvent, false);
            document.addEventListener("appMobi.notification.push.user.edit", pushMobi.onPushNotificationEvent, false);
            document.addEventListener("appMobi.notification.push.user.find", pushMobi.onPushUserFind, false);
            document.addEventListener("appMobi.notification.push.delete", pushMobi.onPushNotificationEvent, false);
            document.addEventListener("appMobi.notification.push.send", pushMobi.onPushNotificationEvent, false);
            document.addEventListener("appMobi.notification.push.refresh", pushMobi.onPushNotificationEvent, false);
            document.addEventListener("appMobi.device.update.available", pushMobi.onUpdateAvailable, false);
        },

        /************************************
               checkPushUser
        ************************************/
        checkPushUser: function (user, pass) {
            un = user,
            pwd = pass,
            email = user + '@appmobi.com'
            AppMobiCloud.notification.checkPushUser(user, pass);

        },
	   authorizeUser: function (username, pass) {
            pushMobi.UserName = username;
            pushMobi.passWord = pass;
            AppMobiCloud.plugin.initialize(function (data) {//success callback
             	var launchImageID = document.getElementById("launchImage");
             	launchImageID.style.display = 'none';
                alert("success");
            }, function (data) {//error callback
             	var launchImageID = document.getElementById("launchImage");
            	 launchImageID.style.display = 'none';
                alert("failure");
            },pushMobi.UserName, pushMobi.passWord);
        },

        /************************************
        ###addPushUser
        (called internally from pushregistered function
        ************************************/

        addPushUser: function (user, pass, mail) {
            AppMobiCloud.notification.addPushUser(user, pass, mail);
        },
		
		saveData: function (key, value,isMaster,isSyncRequired) {
            AppMobiCloud.secureData.saveData(key,value,isMaster,isSyncRequired);
        },
        
        getData: function (key, isMaster) {
            AppMobiCloud.secureData.readData(key,isMaster);
        },

        /*****************************************************************************
           ### DELETE PUSH USER
               - deletes the user from this app
       *****************************************************************************/
        deletePushUser: function () {
            AppMobiCloud.notification.deletePushUser();
        },


        editPushUser: function (email,pass) {
            AppMobiCloud.notification.editPushUser(email, pass)
        },

        /*****************************************************************************		
        FIND PUSH USER By user id
        *****************************************************************************/
        findPushUserByUsername: function (user) {
            AppMobiCloud.notification.findPushUser(user, '');
        },

        /*****************************************************************************		
        FIND PUSH USER By email
        *****************************************************************************/
        findPushUserByEmail: function (email) {
            AppMobiCloud.notification.findPushUser('', email);
        },

        /*****************************************************************************		
          refreshPushNotifications 
         -retrieves notifications from server
        *****************************************************************************/
        refreshPushNotifications: function () {
            AppMobiCloud.notification.refreshPushNotifications();
        },
        /*****************************************************************************		
        send Push notification to specified user id
        *****************************************************************************/
        sendPushNotification: function (user, message, data) {
            AppMobiCloud.notification.sendPushNotification(user, message, data);
        },
        /*****************************************************************************		
        send password of userID to Push User email.
        *****************************************************************************/
        sendPushUserPass: function () {
            AppMobiCloud.notification.sendPushUserPass();
        },
        /*****************************************************************************		
        pushEnabled event called when push user is successfully added in system 
        *****************************************************************************/
        pushEnabled: function (data) {
            if (data.message)
                alert(data.message);
            else
                alert("checkPushUsr/addPushUser success");
            if (!data.success) {
                var didAddPushUser = localStorage.getItem("didAddPushUser");
                if (!didAddPushUser) {
                    pushMobi.addPushUser(un, pwd, email);
                    localStorage.setItem("didAddPushUser", "true");
                }
            }
        },

        /*****************************************************************************		
        pushReceive event called when push is received. 
        *****************************************************************************/
        pushReceive: function (data) {
            var myNotifications = AppMobiCloud.notification.getNotificationsList();
            var len = myNotifications.length;
            if (len > 0) {
                for (i = 0; i < len; i++) {
                    msgObj = AppMobiCloud.notification.getNotificationData(myNotifications[i]);
                    try {
                        if (typeof msgObj == "object" && msgObj.id == myNotifications[i]) {
                            var data = "";
                            if(msgObj.data)
                                data = msgObj.data;
                            AppMobiCloud.notification.alert(msgObj.msg + "\n" + data, "Push Message", "OK");
                            AppMobiCloud.notification.deletePushNotifications(msgObj.id);
                            return;
                        }
                        AppMobiCloud.notification.alert("Invalid Message Object: " + i);
                    } catch (e) {
                        AppMobiCloud.notification.alert("Caught Exception For: " + e.message);
                        //Always mark the messages as read and delete them.
                        //If you dont, your users will get them over and over again.
                        AppMobiCloud.notification.deletePushNotifications(msgObj.id);
                    }
                }
            }
        },

         /*****************************************************************************  
            set Push user attributes
        *****************************************************************************/
        setPushUserAttributes: function (objArr) {
                    AppMobiCloud.notification.setPushUserAttributes(objArr);
         
        },

        setUserData: function (key, value) {
            if (key != '' && value != '') {
                key = key.toLowerCase();

                switch (key.charAt(0)) {
                    case 's':
                        i = new Number(key.charAt(1));
                        if (i < 1 || i > 6) { return this.error('Your attribute key it out of range. It must be between s1 and s6.'); }
                        eval('pushMobi.userAttrs.' + key + '=value;');
                        break;

                    case 'n':
                        num = new Number(value);
                        i = new Number(key.charAt(1));
                        if (i < 1 || i > 4) { return this.error('Your attribute key it out of range. It must be between n1 and n4.'); }
                        if (num == 'NaN') { return this.error('You are supplying a string when a number is expected.'); }
                        eval('pushMobi.userAttrs.' + key + '=value;');
                        break;
                }

                return true;
            } else {
                return false;
            }
        },

        /*****************************************************************************		
            callback for multiple events like pushUser edit, delete etc.
        *****************************************************************************/
        onPushNotificationEvent: function (data) {
            if (data.success == false) {
                alert("error: " + data.message)
            } else {
                alert("success with message : " + data.message);
            }
        },
        /*****************************************************************************		
            callback for findPushUser
        *****************************************************************************/
        onPushUserFind: function (data) {
            if (data.success == false) {
                alert("error: " + data.message)
            } else {
                alert("success with message : " + data.message + ", with userID : " + data.userID);
            }
        },
        /*****************************************************************************		
          callback for PushUserRefresh
      *****************************************************************************/
        onPushUserRefresh: function (data) {
            if (data.success == false) {
                alert("error: " + data.message)
            } else {
                alert("success with message : " + data.message);
            }
        },

        /*****************************************************************************		
            called for case #4 of Live Update
        *****************************************************************************/
        onUpdateAvailable: function (evt) {
            if (evt.type == "appMobi.device.update.available") {
                //there is an update available *while* the application is running - just warn the user
                AppMobiCloud.device.installUpdate();
            }

        },

        InputPushUser: function () {
            alert('Please enter username and password for checking existing user');

        }


    }
}();