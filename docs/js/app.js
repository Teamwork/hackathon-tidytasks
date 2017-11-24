// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
// Define a "Person" class that tracks its own name and children, and has a method to add a new child
var Project, Views, back, changeView, i, len, projects, showProject, tasklists, tasks, viewModel, x;

tasklists = {
  "STATUS": "OK",
  "tasklists": [
    {
      "name": "Bedrooms",
      "pinned": false,
      "milestone-id": "",
      "description": "",
      "uncompleted-count": 6,
      "id": "725038",
      "complete": false,
      "private": false,
      "isTemplate": false,
      "position": 4000,
      "status": "new",
      "projectId": "249091",
      "projectName": "House Renovation",
      "DLM": 1511477458965
    },
    {
      "name": "Garage",
      "pinned": false,
      "milestone-id": "",
      "description": "",
      "uncompleted-count": 8,
      "id": "725039",
      "complete": false,
      "private": false,
      "isTemplate": false,
      "position": 4001,
      "newTaskDefaults": {
        "grantAccessTo": "",
        "dueDateOffset": "",
        "estimated-minutes": 0,
        "description": "",
        "content": "",
        "priority": "",
        "defaultsTaskId": 7000466,
        "viewEstimatedTime": true,
        "private": 0,
        "startDateOffset": "",
        "lockdownId": "",
        "userFollowingComments": false,
        "userFollowingChanges": false,
        "changeFollowerIds": "",
        "commentFollowerIds": "",
        "changeFollowerSummary": "",
        "commentFollowerSummary": "",
        "tags": null,
        "boardColumn": null
      },
      "status": "new",
      "projectId": "249091",
      "projectName": "House Renovation",
      "DLM": 1511477458965
    },
    {
      "name": "Kitchen",
      "pinned": false,
      "milestone-id": "",
      "description": "",
      "uncompleted-count": 5,
      "id": "725041",
      "complete": false,
      "private": false,
      "isTemplate": false,
      "position": 4002,
      "newTaskDefaults": {
        "grantAccessTo": "",
        "dueDateOffset": "",
        "estimated-minutes": 0,
        "description": "",
        "content": "",
        "priority": "",
        "defaultsTaskId": 7000470,
        "viewEstimatedTime": true,
        "private": 0,
        "startDateOffset": "",
        "lockdownId": "",
        "userFollowingComments": false,
        "userFollowingChanges": false,
        "changeFollowerIds": "",
        "commentFollowerIds": "",
        "changeFollowerSummary": "",
        "commentFollowerSummary": "",
        "tags": null,
        "boardColumn": null
      },
      "status": "new",
      "projectId": "249091",
      "projectName": "House Renovation",
      "DLM": 1511477458965
    }
  ]
}.tasklists;

tasks = {
  "STATUS": "OK",
  "tasks": [
    {
      "id": 7000472,
      "name": "Paint!",
      "priority": null,
      "status": "new",
      "parentTaskId": 0,
      "description": "",
      "canViewEstTime": true,
      "createdBy": {
        "id": 170293,
        "firstName": "Rory",
        "lastName": "O'Kelly"
      },
      "dateCreated": "2017-11-23T16:46:00Z",
      "dateChanged": "2017-11-23T16:46:00Z",
      "hasFollowers": false,
      "hasLoggedTime": false,
      "hasReminders": false,
      "hasRemindersForUser": false,
      "hasTickets": false,
      "isPrivate": false,
      "privacyIsInherited": null,
      "lockdownId": 0,
      "numMinutesLogged": 0,
      "numActiveSubTasks": 2,
      "numAttachments": 0,
      "numComments": 0,
      "numCommentsRead": 0,
      "numCompletedSubTasks": 0,
      "numDependencies": 0,
      "numEstMins": 0,
      "numPredecessors": 0,
      "position": 2000,
      "projectId": 249091,
      "startDate": "20171123",
      "assignedTo": [
        {
          "id": 170291,
          "firstName": "Alder",
          "lastName": "Cass"
        }
      ],
      "dueDate": null,
      "dueDateFromMilestone": false,
      "taskListId": 725038,
      "progress": 0,
      "changeFollowerIds": "",
      "commentFollowerIds": "",
      "followingChanges": false,
      "followingComments": false,
      "order": 2000,
      "canComplete": true,
      "canEdit": true,
      "canLogTime": true,
      "DLM": 1511477689127
    },
    {
      "id": 7000512,
      "name": "pick up rollers in homebase",
      "priority": null,
      "status": "new",
      "parentTaskId": 7000472,
      "description": "",
      "canViewEstTime": true,
      "createdBy": {
        "id": 170293,
        "firstName": "Rory",
        "lastName": "O'Kelly"
      },
      "dateCreated": "2017-11-23T16:54:00Z",
      "dateChanged": "2017-11-23T16:54:00Z",
      "hasFollowers": false,
      "hasLoggedTime": false,
      "hasReminders": false,
      "hasRemindersForUser": false,
      "hasTickets": false,
      "isPrivate": false,
      "privacyIsInherited": null,
      "lockdownId": 0,
      "numMinutesLogged": 0,
      "numActiveSubTasks": 0,
      "numAttachments": 0,
      "numComments": 0,
      "numCommentsRead": 0,
      "numCompletedSubTasks": 0,
      "numDependencies": 1,
      "numEstMins": 0,
      "numPredecessors": 0,
      "parentTask": {
        "content": "Paint!",
        "id": 7000472
      },
      "position": 2000,
      "projectId": 249091,
      "startDate": "20171123",
      "assignedTo": [
        {
          "id": 170291,
          "firstName": "Alder",
          "lastName": "Cass"
        }
      ],
      "dueDate": null,
      "dueDateFromMilestone": false,
      "taskListId": 725038,
      "progress": 0,
      "changeFollowerIds": "",
      "commentFollowerIds": "",
      "followingChanges": false,
      "followingComments": false,
      "order": 2000,
      "canComplete": true,
      "canEdit": true,
      "canLogTime": true,
      "DLM": 1511477689127
    },
    {
      "id": 7000473,
      "name": "Order wallpaper for back wall",
      "priority": null,
      "status": "new",
      "parentTaskId": 0,
      "description": "",
      "canViewEstTime": true,
      "createdBy": {
        "id": 170293,
        "firstName": "Rory",
        "lastName": "O'Kelly"
      },
      "dateCreated": "2017-11-23T16:46:00Z",
      "dateChanged": "2017-11-23T16:46:00Z",
      "hasFollowers": false,
      "hasLoggedTime": false,
      "hasReminders": false,
      "hasRemindersForUser": false,
      "hasTickets": false,
      "isPrivate": false,
      "privacyIsInherited": null,
      "lockdownId": 0,
      "numMinutesLogged": 0,
      "numActiveSubTasks": 0,
      "numAttachments": 0,
      "numComments": 0,
      "numCommentsRead": 0,
      "numCompletedSubTasks": 0,
      "numDependencies": 0,
      "numEstMins": 0,
      "numPredecessors": 0,
      "position": 2001,
      "projectId": 249091,
      "startDate": "20171123",
      "assignedTo": [
        {
          "id": 170291,
          "firstName": "Alder",
          "lastName": "Cass"
        }
      ],
      "dueDate": null,
      "dueDateFromMilestone": false,
      "taskListId": 725038,
      "progress": 0,
      "changeFollowerIds": "",
      "commentFollowerIds": "",
      "followingChanges": false,
      "followingComments": false,
      "order": 2001,
      "canComplete": true,
      "canEdit": true,
      "canLogTime": true,
      "DLM": 1511477689127
    },
    {
      "id": 7000514,
      "name": "check in the shed for magnolia",
      "priority": null,
      "status": "new",
      "parentTaskId": 7000472,
      "description": "",
      "canViewEstTime": true,
      "createdBy": {
        "id": 170293,
        "firstName": "Rory",
        "lastName": "O'Kelly"
      },
      "dateCreated": "2017-11-23T16:55:00Z",
      "dateChanged": "2017-11-23T16:55:00Z",
      "hasFollowers": false,
      "hasLoggedTime": false,
      "hasReminders": false,
      "hasRemindersForUser": false,
      "hasTickets": false,
      "isPrivate": false,
      "privacyIsInherited": null,
      "lockdownId": 0,
      "numMinutesLogged": 0,
      "numActiveSubTasks": 0,
      "numAttachments": 0,
      "numComments": 0,
      "numCommentsRead": 0,
      "numCompletedSubTasks": 0,
      "numDependencies": 1,
      "numEstMins": 0,
      "numPredecessors": 0,
      "parentTask": {
        "content": "Paint!",
        "id": 7000472
      },
      "position": 2001,
      "projectId": 249091,
      "startDate": "20171123",
      "assignedTo": [
        {
          "id": 170291,
          "firstName": "Alder",
          "lastName": "Cass"
        }
      ],
      "dueDate": null,
      "dueDateFromMilestone": false,
      "taskListId": 725038,
      "progress": 0,
      "changeFollowerIds": "",
      "commentFollowerIds": "",
      "followingChanges": false,
      "followingComments": false,
      "order": 2001,
      "canComplete": true,
      "canEdit": true,
      "canLogTime": true,
      "DLM": 1511477689127
    },
    {
      "id": 7000518,
      "name": "Take out built-in wardrobe",
      "priority": null,
      "status": "reopened",
      "parentTaskId": 0,
      "description": "",
      "canViewEstTime": true,
      "createdBy": {
        "id": 170293,
        "firstName": "Rory",
        "lastName": "O'Kelly"
      },
      "dateCreated": "2017-11-23T16:55:00Z",
      "dateChanged": "2017-11-23T16:55:00Z",
      "hasFollowers": false,
      "hasLoggedTime": false,
      "hasReminders": false,
      "hasRemindersForUser": false,
      "hasTickets": false,
      "isPrivate": false,
      "privacyIsInherited": null,
      "lockdownId": 0,
      "numMinutesLogged": 0,
      "numActiveSubTasks": 0,
      "numAttachments": 0,
      "numComments": 0,
      "numCommentsRead": 0,
      "numCompletedSubTasks": 0,
      "numDependencies": 0,
      "numEstMins": 0,
      "numPredecessors": 0,
      "position": 2003,
      "projectId": 249091,
      "startDate": "20171123",
      "assignedTo": [
        {
          "id": 170291,
          "firstName": "Alder",
          "lastName": "Cass"
        }
      ],
      "dueDate": null,
      "dueDateFromMilestone": false,
      "taskListId": 725038,
      "progress": 0,
      "changeFollowerIds": "",
      "commentFollowerIds": "",
      "followingChanges": false,
      "followingComments": false,
      "order": 2003,
      "canComplete": true,
      "canEdit": true,
      "canLogTime": true,
      "DLM": 1511486554000
    },
    {
      "id": 7000544,
      "name": "pick up thermal board, plaster slabs",
      "priority": null,
      "status": "new",
      "parentTaskId": 7000537,
      "description": "",
      "canViewEstTime": true,
      "createdBy": {
        "id": 170293,
        "firstName": "Rory",
        "lastName": "O'Kelly"
      },
      "dateCreated": "2017-11-23T16:58:00Z",
      "dateChanged": "2017-11-23T16:58:00Z",
      "hasFollowers": false,
      "hasLoggedTime": false,
      "hasReminders": false,
      "hasRemindersForUser": false,
      "hasTickets": false,
      "isPrivate": false,
      "privacyIsInherited": null,
      "lockdownId": 0,
      "numMinutesLogged": 0,
      "numActiveSubTasks": 0,
      "numAttachments": 0,
      "numComments": 0,
      "numCommentsRead": 0,
      "numCompletedSubTasks": 0,
      "numDependencies": 1,
      "numEstMins": 0,
      "numPredecessors": 0,
      "parentTask": {
        "content": "Insulate and paint walls",
        "id": 7000537
      },
      "position": 2000,
      "projectId": 249091,
      "startDate": "20171123",
      "assignedTo": [
        {
          "id": 170291,
          "firstName": "Alder",
          "lastName": "Cass"
        }
      ],
      "dueDate": null,
      "dueDateFromMilestone": false,
      "taskListId": 725039,
      "progress": 0,
      "changeFollowerIds": "",
      "commentFollowerIds": "",
      "followingChanges": false,
      "followingComments": false,
      "order": 2000,
      "canComplete": true,
      "canEdit": true,
      "canLogTime": true,
      "DLM": 1511477689127
    },
    {
      "id": 7000546,
      "name": "borrow a nail gun",
      "priority": null,
      "status": "new",
      "parentTaskId": 7000537,
      "description": "",
      "canViewEstTime": true,
      "createdBy": {
        "id": 170293,
        "firstName": "Rory",
        "lastName": "O'Kelly"
      },
      "dateCreated": "2017-11-23T16:58:00Z",
      "dateChanged": "2017-11-23T16:58:00Z",
      "hasFollowers": false,
      "hasLoggedTime": false,
      "hasReminders": false,
      "hasRemindersForUser": false,
      "hasTickets": false,
      "isPrivate": false,
      "privacyIsInherited": null,
      "lockdownId": 0,
      "numMinutesLogged": 0,
      "numActiveSubTasks": 0,
      "numAttachments": 0,
      "numComments": 0,
      "numCommentsRead": 0,
      "numCompletedSubTasks": 0,
      "numDependencies": 1,
      "numEstMins": 0,
      "numPredecessors": 0,
      "parentTask": {
        "content": "Insulate and paint walls",
        "id": 7000537
      },
      "position": 2001,
      "projectId": 249091,
      "startDate": "20171123",
      "assignedTo": [
        {
          "id": 170291,
          "firstName": "Alder",
          "lastName": "Cass"
        }
      ],
      "dueDate": null,
      "dueDateFromMilestone": false,
      "taskListId": 725039,
      "progress": 0,
      "changeFollowerIds": "",
      "commentFollowerIds": "",
      "followingChanges": false,
      "followingComments": false,
      "order": 2001,
      "canComplete": true,
      "canEdit": true,
      "canLogTime": true,
      "DLM": 1511477689127
    },
    {
      "id": 7000523,
      "name": "Bring old couch to the dump",
      "priority": null,
      "status": "new",
      "parentTaskId": 0,
      "description": "",
      "canViewEstTime": true,
      "createdBy": {
        "id": 170293,
        "firstName": "Rory",
        "lastName": "O'Kelly"
      },
      "dateCreated": "2017-11-23T16:56:00Z",
      "dateChanged": "2017-11-23T16:56:00Z",
      "hasFollowers": false,
      "hasLoggedTime": false,
      "hasReminders": false,
      "hasRemindersForUser": false,
      "hasTickets": false,
      "isPrivate": false,
      "privacyIsInherited": null,
      "lockdownId": 0,
      "numMinutesLogged": 0,
      "numActiveSubTasks": 0,
      "numAttachments": 0,
      "numComments": 0,
      "numCommentsRead": 0,
      "numCompletedSubTasks": 0,
      "numDependencies": 0,
      "numEstMins": 0,
      "numPredecessors": 0,
      "position": 2001,
      "projectId": 249091,
      "startDate": "20171123",
      "assignedTo": [
        {
          "id": 170291,
          "firstName": "Alder",
          "lastName": "Cass"
        }
      ],
      "dueDate": null,
      "dueDateFromMilestone": false,
      "taskListId": 725039,
      "progress": 0,
      "changeFollowerIds": "",
      "commentFollowerIds": "",
      "followingChanges": false,
      "followingComments": false,
      "order": 2001,
      "canComplete": true,
      "canEdit": true,
      "canLogTime": true,
      "DLM": 1511477689127
    },
    {
      "id": 7000537,
      "name": "Insulate and paint walls",
      "priority": null,
      "status": "new",
      "parentTaskId": 0,
      "description": "",
      "canViewEstTime": true,
      "createdBy": {
        "id": 170293,
        "firstName": "Rory",
        "lastName": "O'Kelly"
      },
      "dateCreated": "2017-11-23T16:58:00Z",
      "dateChanged": "2017-11-23T16:58:00Z",
      "hasFollowers": false,
      "hasLoggedTime": false,
      "hasReminders": false,
      "hasRemindersForUser": false,
      "hasTickets": false,
      "isPrivate": false,
      "privacyIsInherited": null,
      "lockdownId": 0,
      "numMinutesLogged": 0,
      "numActiveSubTasks": 2,
      "numAttachments": 0,
      "numComments": 0,
      "numCommentsRead": 0,
      "numCompletedSubTasks": 0,
      "numDependencies": 0,
      "numEstMins": 0,
      "numPredecessors": 0,
      "position": 2002,
      "projectId": 249091,
      "startDate": "20171123",
      "assignedTo": [
        {
          "id": 170291,
          "firstName": "Alder",
          "lastName": "Cass"
        }
      ],
      "dueDate": null,
      "dueDateFromMilestone": false,
      "taskListId": 725039,
      "progress": 0,
      "changeFollowerIds": "",
      "commentFollowerIds": "",
      "followingChanges": false,
      "followingComments": false,
      "order": 2002,
      "canComplete": true,
      "canEdit": true,
      "canLogTime": true,
      "DLM": 1511477689127
    },
    {
      "id": 7000538,
      "name": "Replace window frame",
      "priority": null,
      "status": "new",
      "parentTaskId": 0,
      "description": "",
      "canViewEstTime": true,
      "createdBy": {
        "id": 170293,
        "firstName": "Rory",
        "lastName": "O'Kelly"
      },
      "dateCreated": "2017-11-23T16:58:00Z",
      "dateChanged": "2017-11-23T16:58:00Z",
      "hasFollowers": false,
      "hasLoggedTime": false,
      "hasReminders": false,
      "hasRemindersForUser": false,
      "hasTickets": false,
      "isPrivate": false,
      "privacyIsInherited": null,
      "lockdownId": 0,
      "numMinutesLogged": 0,
      "numActiveSubTasks": 0,
      "numAttachments": 0,
      "numComments": 0,
      "numCommentsRead": 0,
      "numCompletedSubTasks": 0,
      "numDependencies": 0,
      "numEstMins": 0,
      "numPredecessors": 0,
      "position": 2003,
      "projectId": 249091,
      "startDate": "20171123",
      "assignedTo": [
        {
          "id": 170291,
          "firstName": "Alder",
          "lastName": "Cass"
        }
      ],
      "dueDate": null,
      "dueDateFromMilestone": false,
      "taskListId": 725039,
      "progress": 0,
      "changeFollowerIds": "",
      "commentFollowerIds": "",
      "followingChanges": false,
      "followingComments": false,
      "order": 2003,
      "canComplete": true,
      "canEdit": true,
      "canLogTime": true,
      "DLM": 1511477689127
    },
    {
      "id": 7000539,
      "name": "tidy tools away",
      "priority": null,
      "status": "new",
      "parentTaskId": 0,
      "description": "",
      "canViewEstTime": true,
      "createdBy": {
        "id": 170293,
        "firstName": "Rory",
        "lastName": "O'Kelly"
      },
      "dateCreated": "2017-11-23T16:58:00Z",
      "dateChanged": "2017-11-23T16:58:00Z",
      "hasFollowers": false,
      "hasLoggedTime": false,
      "hasReminders": false,
      "hasRemindersForUser": false,
      "hasTickets": false,
      "isPrivate": false,
      "privacyIsInherited": null,
      "lockdownId": 0,
      "numMinutesLogged": 0,
      "numActiveSubTasks": 0,
      "numAttachments": 0,
      "numComments": 0,
      "numCommentsRead": 0,
      "numCompletedSubTasks": 0,
      "numDependencies": 0,
      "numEstMins": 0,
      "numPredecessors": 0,
      "position": 2004,
      "projectId": 249091,
      "startDate": "20171123",
      "assignedTo": [
        {
          "id": 170291,
          "firstName": "Alder",
          "lastName": "Cass"
        }
      ],
      "dueDate": null,
      "dueDateFromMilestone": false,
      "taskListId": 725039,
      "progress": 0,
      "changeFollowerIds": "",
      "commentFollowerIds": "",
      "followingChanges": false,
      "followingComments": false,
      "order": 2004,
      "canComplete": true,
      "canEdit": true,
      "canLogTime": true,
      "DLM": 1511477689127
    },
    {
      "id": 7001684,
      "name": "Stack boxes",
      "priority": null,
      "status": "new",
      "parentTaskId": 0,
      "description": "",
      "canViewEstTime": true,
      "createdBy": {
        "id": 170293,
        "firstName": "Rory",
        "lastName": "O'Kelly"
      },
      "dateCreated": "2017-11-23T17:24:00Z",
      "dateChanged": "2017-11-23T17:24:00Z",
      "hasFollowers": false,
      "hasLoggedTime": false,
      "hasReminders": false,
      "hasRemindersForUser": false,
      "hasTickets": false,
      "isPrivate": false,
      "privacyIsInherited": null,
      "lockdownId": 0,
      "numMinutesLogged": 0,
      "numActiveSubTasks": 0,
      "numAttachments": 0,
      "numComments": 0,
      "numCommentsRead": 0,
      "numCompletedSubTasks": 0,
      "numDependencies": 0,
      "numEstMins": 0,
      "numPredecessors": 0,
      "position": 2005,
      "projectId": 249091,
      "startDate": "20171123",
      "assignedTo": [
        {
          "id": 170291,
          "firstName": "Alder",
          "lastName": "Cass"
        }
      ],
      "dueDate": null,
      "dueDateFromMilestone": false,
      "taskListId": 725039,
      "progress": 0,
      "changeFollowerIds": "",
      "commentFollowerIds": "",
      "followingChanges": false,
      "followingComments": false,
      "order": 2005,
      "canComplete": true,
      "canEdit": true,
      "canLogTime": true,
      "DLM": 1511477689127
    },
    {
      "id": 7001686,
      "name": "build new integrated shelves",
      "priority": null,
      "status": "new",
      "parentTaskId": 0,
      "description": "",
      "canViewEstTime": true,
      "createdBy": {
        "id": 170293,
        "firstName": "Rory",
        "lastName": "O'Kelly"
      },
      "dateCreated": "2017-11-23T17:24:00Z",
      "dateChanged": "2017-11-23T17:24:00Z",
      "hasFollowers": false,
      "hasLoggedTime": false,
      "hasReminders": false,
      "hasRemindersForUser": false,
      "hasTickets": false,
      "isPrivate": false,
      "privacyIsInherited": null,
      "lockdownId": 0,
      "numMinutesLogged": 0,
      "numActiveSubTasks": 0,
      "numAttachments": 0,
      "numComments": 0,
      "numCommentsRead": 0,
      "numCompletedSubTasks": 0,
      "numDependencies": 0,
      "numEstMins": 0,
      "numPredecessors": 0,
      "position": 2006,
      "projectId": 249091,
      "startDate": "20171123",
      "assignedTo": [
        {
          "id": 170291,
          "firstName": "Alder",
          "lastName": "Cass"
        }
      ],
      "dueDate": null,
      "dueDateFromMilestone": false,
      "taskListId": 725039,
      "progress": 0,
      "changeFollowerIds": "",
      "commentFollowerIds": "",
      "followingChanges": false,
      "followingComments": false,
      "order": 2006,
      "canComplete": true,
      "canEdit": true,
      "canLogTime": true,
      "DLM": 1511477689127
    },
    {
      "id": 7000553,
      "name": "Paint walls",
      "priority": null,
      "status": "new",
      "parentTaskId": 0,
      "description": "",
      "canViewEstTime": true,
      "createdBy": {
        "id": 170293,
        "firstName": "Rory",
        "lastName": "O'Kelly"
      },
      "dateCreated": "2017-11-23T16:59:00Z",
      "dateChanged": "2017-11-23T16:59:00Z",
      "hasFollowers": false,
      "hasLoggedTime": false,
      "hasReminders": false,
      "hasRemindersForUser": false,
      "hasTickets": false,
      "isPrivate": false,
      "privacyIsInherited": null,
      "lockdownId": 0,
      "numMinutesLogged": 0,
      "numActiveSubTasks": 0,
      "numAttachments": 0,
      "numComments": 0,
      "numCommentsRead": 0,
      "numCompletedSubTasks": 0,
      "numDependencies": 0,
      "numEstMins": 0,
      "numPredecessors": 0,
      "position": 2001,
      "projectId": 249091,
      "startDate": "20171123",
      "assignedTo": [
        {
          "id": 170291,
          "firstName": "Alder",
          "lastName": "Cass"
        }
      ],
      "dueDate": null,
      "dueDateFromMilestone": false,
      "taskListId": 725041,
      "progress": 0,
      "changeFollowerIds": "",
      "commentFollowerIds": "",
      "followingChanges": false,
      "followingComments": false,
      "order": 2001,
      "canComplete": true,
      "canEdit": true,
      "canLogTime": true,
      "DLM": 1511477689127
    },
    {
      "id": 7000554,
      "name": "Sand down and paint bench",
      "priority": null,
      "status": "new",
      "parentTaskId": 0,
      "description": "",
      "canViewEstTime": true,
      "createdBy": {
        "id": 170293,
        "firstName": "Rory",
        "lastName": "O'Kelly"
      },
      "dateCreated": "2017-11-23T16:59:00Z",
      "dateChanged": "2017-11-23T16:59:00Z",
      "hasFollowers": false,
      "hasLoggedTime": false,
      "hasReminders": false,
      "hasRemindersForUser": false,
      "hasTickets": false,
      "isPrivate": false,
      "privacyIsInherited": null,
      "lockdownId": 0,
      "numMinutesLogged": 0,
      "numActiveSubTasks": 0,
      "numAttachments": 0,
      "numComments": 0,
      "numCommentsRead": 0,
      "numCompletedSubTasks": 0,
      "numDependencies": 0,
      "numEstMins": 0,
      "numPredecessors": 0,
      "position": 2002,
      "projectId": 249091,
      "startDate": "20171123",
      "assignedTo": [
        {
          "id": 170291,
          "firstName": "Alder",
          "lastName": "Cass"
        }
      ],
      "dueDate": null,
      "dueDateFromMilestone": false,
      "taskListId": 725041,
      "progress": 0,
      "changeFollowerIds": "",
      "commentFollowerIds": "",
      "followingChanges": false,
      "followingComments": false,
      "order": 2002,
      "canComplete": true,
      "canEdit": true,
      "canLogTime": true,
      "DLM": 1511477689127
    },
    {
      "id": 7000561,
      "name": "Finish skirting board",
      "priority": null,
      "status": "new",
      "parentTaskId": 0,
      "description": "",
      "canViewEstTime": true,
      "createdBy": {
        "id": 170293,
        "firstName": "Rory",
        "lastName": "O'Kelly"
      },
      "dateCreated": "2017-11-23T16:59:00Z",
      "dateChanged": "2017-11-23T16:59:00Z",
      "hasFollowers": false,
      "hasLoggedTime": false,
      "hasReminders": false,
      "hasRemindersForUser": false,
      "hasTickets": false,
      "isPrivate": false,
      "privacyIsInherited": null,
      "lockdownId": 0,
      "numMinutesLogged": 0,
      "numActiveSubTasks": 0,
      "numAttachments": 0,
      "numComments": 0,
      "numCommentsRead": 0,
      "numCompletedSubTasks": 0,
      "numDependencies": 0,
      "numEstMins": 0,
      "numPredecessors": 0,
      "position": 2003,
      "projectId": 249091,
      "startDate": "20171123",
      "assignedTo": [
        {
          "id": 170291,
          "firstName": "Alder",
          "lastName": "Cass"
        }
      ],
      "dueDate": null,
      "dueDateFromMilestone": false,
      "taskListId": 725041,
      "progress": 0,
      "changeFollowerIds": "",
      "commentFollowerIds": "",
      "followingChanges": false,
      "followingComments": false,
      "order": 2003,
      "canComplete": true,
      "canEdit": true,
      "canLogTime": true,
      "DLM": 1511477689127
    },
    {
      "id": 7000570,
      "name": "Take out door between sitting room and kitchen",
      "priority": null,
      "status": "new",
      "parentTaskId": 0,
      "description": "",
      "canViewEstTime": true,
      "createdBy": {
        "id": 170293,
        "firstName": "Rory",
        "lastName": "O'Kelly"
      },
      "dateCreated": "2017-11-23T17:00:00Z",
      "dateChanged": "2017-11-23T17:00:00Z",
      "hasFollowers": false,
      "hasLoggedTime": false,
      "hasReminders": false,
      "hasRemindersForUser": false,
      "hasTickets": false,
      "isPrivate": false,
      "privacyIsInherited": null,
      "lockdownId": 0,
      "numMinutesLogged": 0,
      "numActiveSubTasks": 0,
      "numAttachments": 0,
      "numComments": 0,
      "numCommentsRead": 0,
      "numCompletedSubTasks": 0,
      "numDependencies": 0,
      "numEstMins": 0,
      "numPredecessors": 0,
      "position": 2004,
      "projectId": 249091,
      "startDate": "20171123",
      "assignedTo": [
        {
          "id": 170291,
          "firstName": "Alder",
          "lastName": "Cass"
        }
      ],
      "dueDate": null,
      "dueDateFromMilestone": false,
      "taskListId": 725041,
      "progress": 0,
      "changeFollowerIds": "",
      "commentFollowerIds": "",
      "followingChanges": false,
      "followingComments": false,
      "order": 2004,
      "canComplete": true,
      "canEdit": true,
      "canLogTime": true,
      "DLM": 1511477689127
    },
    {
      "id": 7000572,
      "name": "New shelf for photos, cookery books",
      "priority": null,
      "status": "new",
      "parentTaskId": 0,
      "description": "",
      "canViewEstTime": true,
      "createdBy": {
        "id": 170293,
        "firstName": "Rory",
        "lastName": "O'Kelly"
      },
      "dateCreated": "2017-11-23T17:00:00Z",
      "dateChanged": "2017-11-23T17:00:00Z",
      "hasFollowers": false,
      "hasLoggedTime": false,
      "hasReminders": false,
      "hasRemindersForUser": false,
      "hasTickets": false,
      "isPrivate": false,
      "privacyIsInherited": null,
      "lockdownId": 0,
      "numMinutesLogged": 0,
      "numActiveSubTasks": 0,
      "numAttachments": 0,
      "numComments": 0,
      "numCommentsRead": 0,
      "numCompletedSubTasks": 0,
      "numDependencies": 0,
      "numEstMins": 0,
      "numPredecessors": 0,
      "position": 2005,
      "projectId": 249091,
      "startDate": "20171123",
      "assignedTo": [
        {
          "id": 170291,
          "firstName": "Alder",
          "lastName": "Cass"
        }
      ],
      "dueDate": null,
      "dueDateFromMilestone": false,
      "taskListId": 725041,
      "progress": 0,
      "changeFollowerIds": "",
      "commentFollowerIds": "",
      "followingChanges": false,
      "followingComments": false,
      "order": 2005,
      "canComplete": true,
      "canEdit": true,
      "canLogTime": true,
      "DLM": 1511477689127
    }
  ]
}.tasks;

projects = {
  "letters": ["H"],
  "STATUS": "OK",
  "projects": [
    {
      "replyByEmailEnabled": true,
      "starred": false,
      "notifySettings": {
        "taskByEmailEveryone": false,
        "linkEveryone": false,
        "commentIncludeAssigned": true,
        "messageEveryone": false,
        "fileEveryone": false,
        "privateItemEveryone": false,
        "milestoneAssignee": false,
        "notebookEveryone": false,
        "commentIncludeCreator": true,
        "taskAssignee": false,
        "commentIncludeCompleter": true,
        "messageByEmailEveryone": false,
        "allowNotifyAnyone": false
      },
      "show-announcement": false,
      "harvest-timers-enabled": false,
      "status": "active",
      "subStatus": "current",
      "defaultPrivacy": "open",
      "integrations": {
        "microsoftConnectors": {
          "enabled": false
        },
        "onedrivebusiness": {
          "enabled": false,
          "folder": "root",
          "account": "",
          "foldername": "root"
        }
      },
      "created-on": "2017-11-23T16:44:40Z",
      "category": {
        "name": "",
        "id": "",
        "color": ""
      },
      "filesAutoNewVersion": false,
      "tags": [],
      "overview-start-page": "default",
      "logo": "",
      "startDate": "",
      "id": "249091",
      "last-changed-on": "2017-11-23T17:24:08Z",
      "defaults": {
        "privacy": ""
      },
      "endDate": "",
      "company": {
        "name": "Tidy Tasks",
        "is-owner": "1",
        "id": "89204"
      },
      "tasks-start-page": "default",
      "active-pages": {
        "links": "1",
        "tasks": "1",
        "time": "1",
        "billing": "1",
        "notebooks": "1",
        "files": "1",
        "comments": "1",
        "riskRegister": "1",
        "milestones": "1",
        "messages": "1"
      },
      "name": "House Renovation",
      "privacyEnabled": false,
      "description": "",
      "announcement": "",
      "permissions": {
        "canAddTaskLists": true,
        "viewNotebook": true,
        "canAccessOneDriveBusiness": true,
        "receiveEmailNotifications": true,
        "projectAdministrator": true,
        "viewMessagesAndFiles": true,
        "canAddLinks": true,
        "canAddMessages": true,
        "isObserving": false,
        "notifyDefaults": {
          "newTasks": "0"
        },
        "canAccess": true,
        "canEditAllTasks": true,
        "canAccessBox": false,
        "viewTimeLog": true,
        "canSetPrivacy": true,
        "canAddNotebooks": true,
        "viewLinks": true,
        "isArchived": false,
        "viewTasksAndMilestones": true,
        "viewEstimatedTime": true,
        "viewAllTimeLogs": true,
        "canAddMilestones": true,
        "canLogTime": true,
        "canAccessDropbox": false,
        "canAddFiles": true,
        "canAccessGoogleDocs": false,
        "canAccessInvoiceTracking": true,
        "viewRiskRegister": true,
        "canAddTasks": true,
        "active": true,
        "canAccessOneDrive": false
      },
      "isProjectAdmin": true,
      "start-page": "projectoverview",
      "notifyeveryone": false,
      "boardData": {}
    }
  ],
  "categoryPath": [
    {
      "name": "All projects",
      "id": "-1"
    }
  ]
}.projects;

// views on page
// defaults to bodyClass null, showheader null
Views = {
  login: {
    bodyClass: "blue",
    showHeader: false
  },
  dash: {
    bodyClass: "blue"
  },
  tasks: {},
  addTask: {}
};

Project = function(project) {
  // access project original data with .project
  this.project = project;
  // map relevant tasklists to .tasklists property
  this.tasklists = ko.observableArray(tasklists.filter(function(x) {
    return x.projectId === project.id;
  }).map(function(x) {
    // add in relevant tasks from big list of tasks
    x.tasks = tasks.filter(function(y) {
      return parseInt(y.taskListId) === parseInt(x.id);
    });
    
    // bool for collapsed state
    x.isCollapsed = false;
    x.collapse = (function() {
      console.log(this.isCollapsed);
      this.isCollapsed = !this.isCollapsed;
      return false;
    });
    return x;
  }));
  
  // not sure how to do this one, hardcoding to 6 for now
  this.upcomingTasks = 6; //? TODO
  // count all tasks in every tasklist in the project
  this.counttasks = (function() {
    return tasklists.map(function(item) {
      return item.tasks.length;
    }).reduce(function(x, y) {
      return x + y;
    });
  }).bind(this);
  // get percentage of tasks completed by getting incomplete percentage and taking it from 100
  this.progress = (function() {
    return tasklists.map(function(item) {
      var incompletedPC;
      incompletedPC = item["uncompleted-count"] / item.tasks.length; // percentage of completed tasks
      return incompletedPC;
    }).reduce(function(x, y) {
      return x + y;
    });
  }).bind(this);
};


// The view model is an abstract description of the state of the UI, but without any knowledge of the UI technology (HTML)
viewModel = {
  viewKey: ko.observable('login'),
  lastKey: '',
  tasksDue: 4,
  username: 'Mark',
  currentProject: null,
  projects: ko.observableArray(),
  showAddTask: function() {
    return this.showPage = "add-task";
  }
};


// viewModel.tasksDue = ko.computedObservable(viewModel.projects()
//   .map (item) ->
//     item.tasksDue
//   .reduce (x,y) ->
//     x+y    
// )
console.log();

changeView = function(key, model) {
  console.log(model, key);
  viewModel.lastKey = viewModel.viewKey();
  return viewModel.viewKey(key);
};

back = function(key, model) {
  return viewModel.viewKey(viewModel.lastKey);
};

showProject = function(model, project) {
  viewModel.currentProject = project;
  changeView('tasks');
  return console.log(model);
};

for (i = 0, len = projects.length; i < len; i++) {
  x = projects[i];
  viewModel.projects.push(new Project(x));
}

viewModel.currentProject = viewModel.projects()[0];

ko.applyBindings(viewModel);

console.log(viewModel.currentProject);

// ---
// generated by js2coffee 2.2.0
