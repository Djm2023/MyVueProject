// utils/meetingType.js

import UsersIcon from '../components/icons/UsersIcon.vue'
import ClientMeetingIcon from '../components/icons/ClientMeetingIcon.vue'
import GeneralMeetingIcon from '../components/icons/GeneralMeetingIcon.vue'
import MediationIcon from '../components/icons/MediationIcon.vue'

export const meetingTypes = [
  {
    id: 1,
    title: 'Client Consultation',
    bgColor: 'bg-custom-blue',
    icon: UsersIcon
  },
  {
    id: 2,
    title: 'Client Meeting',
    bgColor: 'bg-custom-emerald',
    icon: ClientMeetingIcon
  },
  {
    id: 3,
    title: 'General Meeting',
    bgColor: 'bg-custom-yellow',
    icon: GeneralMeetingIcon
  },
  {
    id: 4,
    title: 'Mediation',
    bgColor: 'bg-custom-purple',
    icon: MediationIcon
  }
]
