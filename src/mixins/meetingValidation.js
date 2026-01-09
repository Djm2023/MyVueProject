export default {
  data() {
    return {
      meetTitle: '',
      selectedClient: '',
      selectedLawyer: '',
      appointmentDate: '',
      startTime: '',
      endTime: '',
      paymentStatus: '',
      amount: '',

      errors: {
        meetTitle: '',
        selectedClient: '',
        selectedLawyer: '',
        appointmentDate: '',
        startTime: '',
        endTime: '',
        paymentStatus: '',
        amount: '',
      }
    }
  },

  watch: {
    meetTitle(value) {
      this.errors.meetTitle = value.trim() ? '' : 'This field is required.'
    },

    selectedClient(value) {
      this.errors.selectedClient = value ? '' : 'Please select a client.'
    },

    selectedLawyer(value) {
      this.errors.selectedLawyer = value ? '' : 'Please select a lawyer.'
    },

    appointmentDate(value) {
      this.errors.appointmentDate = value ? '' : 'Please select appointment date.'
    },

    startTime(value) {
      this.errors.startTime = value ? '' : 'Please select start time.'
    },

    endTime(value) {
      this.errors.endTime = value ? '' : 'Please select end time.'
    },

    paymentStatus(value) {
      this.errors.paymentStatus = value ? '' : 'Please select payment status.'
    },

    amount(value) {
      if (!value) {
        this.errors.amount = 'Amount is required.'
      } else if (isNaN(value)) {
        this.errors.amount = 'Amount must be a number.'
      } else {
        this.errors.amount = ''
      }
    }
  },

  methods: {
    validateForm(isClientMeeting, isGeneralMeeting) {
      let valid = true

      if ((isClientMeeting || isGeneralMeeting) && !this.meetTitle.trim()) {
        this.errors.meetTitle = 'This field is required.'
        valid = false
      }

      if (!this.selectedClient) {
        this.errors.selectedClient = 'Please select a client.'
        valid = false
      }

      if (!this.selectedLawyer) {
        this.errors.selectedLawyer = 'Please select a lawyer.'
        valid = false
      }

      if (!this.appointmentDate) {
        this.errors.appointmentDate = 'Please select appointment date.'
        valid = false
      }

      if (!this.startTime) {
        this.errors.startTime = 'Please select start time.'
        valid = false
      }

      if (!this.endTime) {
        this.errors.endTime = 'Please select end time.'
        valid = false
      }

      if (!this.paymentStatus) {
        this.errors.paymentStatus = 'Please select payment status.'
        valid = false
      }

      if (!this.amount || isNaN(this.amount)) {
        this.errors.amount = 'Amount is required.'
        valid = false
      }

      return valid
    }
  }
}
