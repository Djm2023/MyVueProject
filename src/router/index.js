import Vue from 'vue'
import Router from 'vue-router'

import Home from '../views/Home.vue'
import ScheduleMeeting from '../views/ScheduleMeeting.vue'
import MeetingDetails from '../views/MeetingDetails.vue'
import ScheduleConsultation from '../views/ScheduleMeetingMode.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',  
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/schedule-meeting',
      name: 'ScheduleMeeting',
      component: ScheduleMeeting
    },
    {
      path: '/schedule-meeting/client-consultation',
      name: 'ClientConsultation',
      component: MeetingDetails
    },
    {
      path: '/schedule-meeting/client-consultation/mode',
      name: 'ScheduleConsultation',
      component: ScheduleConsultation
    },
    {
      path: '/schedule-meeting/client-meeting',
      name: 'ClientMeeting',
      component: MeetingDetails
    },
    {
      path: '/schedule-meeting/general-meeting',
      name: 'GeneralMeeting',
      component: MeetingDetails
    }
  ]
})
