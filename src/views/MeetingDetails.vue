<template>
  <div class="meeting-schedule-wrapper">
    <div class="meeting-schedule-card">
      <div :class="['meeting-schedule-header', currentMeeting.bgColor]">
        <div class="meeting-schedule-header-icon">
          <component
            :is="currentMeeting.icon"
            class="meeting-schedule-header-icon-color"
          />
        </div>

        <div>
          <h2 class="meeting-schedule-header-title">Meeting Details</h2>
          <p class="meeting-schedule-header-subtitle">
            {{ currentMeeting.title }}
          </p>
        </div>
      </div>

      <div class="meeting-schedule-body">
        <section v-if="isClientMeeting || isGeneralMeeting">
          <div class="title-row">
            <label>Title :</label>
            <input
              type="text"
              v-model="meetTitle"
              :class="[
                'meeting-schedule-input',
                errors.meetTitle ? 'error-input' : '',
              ]"
              placeholder="Enter title"
            />
          </div>
          <p v-if="errors.meetTitle" class="error-text error-title">
            {{ errors.meetTitle }}
          </p>
        </section>

        <section>
          <h3 class="meeting-schedule-section-title">Participants</h3>
          <div class="meeting-schedule-grid-3">
            <div class="field-wrapper">
              <label class="meeting-schedule-label">Choose a client</label>
              <!-- SEARCHABLE SELECT (GEN MEETING) -->
              <div class="multi-select-wrapper" ref="clientBox">
                <!-- Search Field -->
                <input
                  type="text"
                  :value="selectedClientName"
                  @focus="openDropdown"
                  @input="onSearchInput"
                  placeholder="Search client..."
                  class="meeting-schedule-input"
                />

                <!-- Dropdown Panel -->
                <div v-if="showClientDropdown" class="dropdown-panel">
                  <!-- Options -->
                  <div
                    v-for="lawyer in filteredClientList"
                    :key="lawyer.id"
                    class="dropdown-item"
                    @click="selectClient(lawyer)"
                  >
                    {{ lawyer.name }}
                  </div>

                  <!-- Add New Client -->
                  <div
                    v-if="filteredClientList.length === 0"
                    class="dropdown-item no-result"
                  >
                    No Result found
                  </div>
                </div>

                <p v-if="errors.selectedClient" class="error-text">
                  {{ errors.selectedClient }}
                </p>
              </div>
            </div>

            <div class="field-wrapper">
              <label class="meeting-schedule-label">Choose Lawyer</label>

              <div class="multi-select-wrapper" ref="lawyerBox">
                <input
                  type="text"
                  :value="selectedLawyerName"
                  @focus="openLawyerDropdown"
                  @input="onSearchLawyerInput"
                  placeholder="Search lawyer..."
                  :class="[
                    'meeting-schedule-input',
                    errors.selectedLawyer ? 'error-input' : '',
                  ]"
                />

                <!-- Dropdown -->
                <div v-if="showLawyerDropdown" class="dropdown-panel">
                  <!-- Lawyer List -->
                  <div
                    v-for="lawyer in filteredLawyerList"
                    :key="lawyer.id"
                    class="dropdown-item"
                    @click="selectLawyer(lawyer)"
                  >
                    {{ lawyer.name }}
                  </div>

                  <!-- No Result Found -->
                  <div
                    v-if="filteredLawyerList.length === 0"
                    class="dropdown-item no-result"
                  >
                    No Result Found
                  </div>
                </div>
              </div>

              <p v-if="errors.selectedLawyer" class="error-text">
                {{ errors.selectedLawyer }}
              </p>
            </div>

            <div class="field-wrapper">
              <button class="meeting-schedule-button-check-availability">
                Check Availability
              </button>
            </div>
          </div>
        </section>

        <section v-if="isGeneralMeeting">
          <div class="attendee-row">
            <span class="attendee-label">Attendees :</span>

            <div class="attendee-container" ref="attendeeBox">
              <!-- Selected Attendee Chips -->
              <div class="selected-attendees" @click="openAttendeeDropdown">
                <span
                  v-for="att in selectedAttendees"
                  :key="att.id"
                  class="attendee-chip-inline"
                >
                  {{ att.name }}
                  <span
                    class="attendee-remove"
                    @click.stop="removeSelectedAttendee(att)"
                    >×</span
                  >
                </span>

                <!-- Search Input -->
                <input
                  type="text"
                  v-model="searchAttendee"
                  class="attendee-search-input"
                  placeholder="Search attendee..."
                  @input="onAttendeeSearchInput"
                  @focus="openAttendeeDropdown"
                />
              </div>

              <!-- Dropdown -->
              <div v-if="showAttendeeDropdown" class="attendee-dropdown">
                <div
                  class="dropdown-item"
                  v-for="att in filteredAttendees"
                  :key="att.id"
                  @click="selectAttendee(att)"
                >
                  <strong>{{ att.name }}</strong>
                  <!-- <small>({{ att.email }})</small> -->
                </div>

                <div v-if="filteredAttendees.length === 0" class="no-result">
                  No attendee found
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h3 class="meeting-schedule-section-title">Date & Time</h3>
          <div class="meeting-schedule-grid-3">
            <div class="field-wrapper">
              <label class="meeting-schedule-label">Appointment Date</label>
              <input
                type="date"
                v-model="appointmentDate"
                :class="[
                  'meeting-schedule-input',
                  errors.appointmentDate ? 'error-input' : '',
                ]"
              />
              <p v-if="errors.appointmentDate" class="error-text">
                {{ errors.appointmentDate }}
              </p>
            </div>

            <div class="field-wrapper">
              <label class="meeting-schedule-label">Start Time</label>
              <div class="time-picker-container" ref="startPicker">
                <!-- Input box -->
                <input
                  type="text"
                  class="time-input"
                  v-model="startTime"
                  @focus="openStartDropdown"
                  @click="openStartDropdown"
                  @input="filterStartTimes"
                  placeholder="HH:MM"
                />

                <!-- Dropdown -->
                <ul v-if="showStartDropdown" class="time-dropdown">
                  <li
                    v-for="t in filteredStartTimes"
                    :key="t"
                    class="time-option"
                    @click="selectStartTime(t)"
                  >
                    {{ t }}
                  </li>
                </ul>
              </div>
              <p v-if="errors.startTime" class="error-text">
                {{ errors.startTime }}
              </p>
            </div>

            <div class="field-wrapper">
              <label class="meeting-schedule-label">End Time</label>
              <div class="time-picker-container" ref="endPicker">
                <input
                  type="text"
                  class="time-input"
                  v-model="endTime"
                  @focus="openEndDropdown"
                  @click="openEndDropdown"
                  @input="filterEndTimes"
                  placeholder="HH:MM"
                />

                <ul v-if="showEndDropdown" class="time-dropdown">
                  <li
                    v-for="t in filteredEndTimes"
                    :key="'end-' + t"
                    class="time-option"
                    @click="selectEndTime(t)"
                  >
                    {{ t }}
                  </li>
                </ul>
              </div>
              <p v-if="errors.endTime" class="error-text">
                {{ errors.endTime }}
              </p>
            </div>
          </div>
        </section>

        <section v-if="!isGeneralMeeting">
          <h3 class="meeting-schedule-section-title">Payment Details</h3>
          <div class="meeting-schedule-grid-2">
            <!-- <div class="field-wrapper">
              <label class="meeting-schedule-label">Amount</label>
              <input
                type="number"
                v-model="amount"
                :class="[
                  'meeting-schedule-input',
                  errors.amount ? 'error-input' : '',
                ]"
              />
              <p v-if="errors.amount" class="error-text">{{ errors.amount }}</p>
            </div> -->

            <div class="field-wrapper">
              <label class="meeting-schedule-label">Amount</label>

              <div class="amount-input-group">
                <select v-model="currency" class="currency-select">
                  <option value="Rs">Rs</option>
                  <option value="USD">USD</option>
                </select>

                <input
                  type="number"
                  v-model="amount"
                  class="amount-input"
                  :class="[errors.amount ? 'error-input' : '']"
                  placeholder="Enter amount"
                />
              </div>

              <p v-if="errors.amount" class="error-text">{{ errors.amount }}</p>
            </div>

            <div class="field-wrapper">
              <label class="meeting-schedule-label">Payment Status</label>
              <div class="meeting-schedule-radio-group">
                <label
                  ><input type="radio" value="Paid" v-model="paymentStatus" />
                  Paid</label
                >
                <label
                  ><input
                    type="radio"
                    value="Partial"
                    v-model="paymentStatus"
                  />
                  Partial</label
                >
                <label
                  ><input
                    type="radio"
                    value="Pending"
                    v-model="paymentStatus"
                  />
                  Pending</label
                >
                <label
                  ><input type="radio" value="NA" v-model="paymentStatus" />
                  N/A</label
                >
              </div>
              <p v-if="errors.paymentStatus" class="error-text">
                {{ errors.paymentStatus }}
              </p>
            </div>
          </div>
        </section>

        <div class="meeting-schedule-actions">
          <button class="meeting-schedule-btn-outline" @click="$router.back()">
            Back
          </button>
          <button class="meeting-schedule-btn-primary" @click="goNext">
            Next
          </button>
        </div>
      </div>
    </div>

    <div class="calendar-sidebar">
      <date-picker
        v-model="appointmentDate"
        inline
        type="date"
        value-type="format"
        format="YYYY-MM-DD"
        :disabled-date="disableBlockedDates"
      ></date-picker>

      <!-- <p
        v-if="errors.appointmentDate"
        class="error-text"
        style="text-align: center; margin-top: 10px"
      >
        {{ errors.appointmentDate }}
      </p> -->
    </div>
  </div>
</template>

<script>
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
import { meetingTypes } from "../utils/meetingType";
import { getRandomChipColor } from "../utils/randomChipColor";
import { dummyLawyers } from "../dummyData/allLawyers";
import "../assets/styles/MeetingDetails.css";

export default {
  name: "MeetingDetails",
  components: { DatePicker },

  data() {
    return {
      clientList: [], // list of clients
      lawyerList: [],

      meetTitle: "",
      isGenMeeting: false,

      // MULTISELECT UPDATED
      selectedClient: null, // was string, now array
      searchClient: "",
      searchLawyer: "", // FIX ADDED
      showClientDropdown: false,
      showLawyerDropdown: false, // FIX ADDED

      singleSelectedClient: null,

      selectedLawyer: "",
      appointmentDate: "",
      startTime: "",
      endTime: "",
      paymentStatus: "",
      errors: {},

      blockedDates: ["2026-01-20", "2026-01-22", "2026-01-25"],

      attendeeList: [
        { id: 1, name: "Devjyoti", email: "devjyoti@gmail.com" },
        { id: 2, name: "Rahul", email: "rahul@gmail.com" },
        { id: 3, name: "Priya", email: "priya@gmail.com" },
        { id: 4, name: "Amit", email: "amit@gmail.com" },
      ],

      selectedAttendees: [],
      showAttendeeDropdown: false,
      searchAttendee: "",
      attendeeColors: [],

      startDisplay: "",
      endDisplay: "",
      showStartDropdown: false,
      showEndDropdown: false,

      filteredStartTimes: [], // FIX ADDED
      filteredEndTimes: [], // FIX ADDED

      currency: "Rs",
      amount: "",

      timeSlots: Array.from({ length: 48 }, (_, i) => {
        const hour = String(Math.floor(i / 2)).padStart(2, "0");
        const minute = i % 2 === 0 ? "00" : "30";
        return `${hour}:${minute}`;
      }),
    };
  },

  watch: {
    isGeneralMeeting(newVal) {
      this.isGenMeeting = newVal;
    },

    // selectedClient: {
    //   handler(newClients) {
    //     if (!this.isGeneralMeeting) return;

    //     const list = Array.isArray(newClients) ? newClients : [];

    //     const lawyerObject = this.selectedLawyer
    //       ? {
    //           id: "lawyer",
    //           name: this.selectedLawyer.name || this.selectedLawyer,
    //         }
    //       : null;

    //     this.attendeeList = [
    //       ...list.map((c) => ({ id: c.id, name: c.name })),
    //       ...(lawyerObject ? [lawyerObject] : []),
    //     ];
    //   },
    //   deep: true,
    // },

    // singleSelectedClient(newVal) {
    //   if (this.isGeneralMeeting) return;

    //   const lawyerObject = this.selectedLawyer
    //     ? {
    //         id: "lawyer",
    //         name: this.selectedLawyer.name || this.selectedLawyer,
    //       }
    //     : null;

    //   this.attendeeList = newVal
    //     ? [
    //         { id: newVal.id, name: newVal.name },
    //         ...(lawyerObject ? [lawyerObject] : []),
    //       ]
    //     : [...(lawyerObject ? [lawyerObject] : [])];
    // },

    // selectedLawyer(newVal) {
    //   const lawyerObject = newVal
    //     ? { id: "lawyer", name: newVal.name || newVal }
    //     : null;

    //   if (this.isGeneralMeeting) {
    //     this.attendeeList = [
    //       ...this.selectedClient.map((c) => ({ id: c.id, name: c.name })),
    //       ...(lawyerObject ? [lawyerObject] : []),
    //     ];
    //   } else {
    //     this.attendeeList = this.singleSelectedClient
    //       ? [
    //           {
    //             id: this.singleSelectedClient.id,
    //             name: this.singleSelectedClient.name,
    //           },
    //           ...(lawyerObject ? [lawyerObject] : []),
    //         ]
    //       : [...(lawyerObject ? [lawyerObject] : [])];
    //   }
    // },

    // attendeeList(newVal) {
    //   this.attendeeColors = newVal.map(() => getRandomChipColor());
    // },
  },

  computed: {
    filteredClientList() {
      if (!this.searchClient) return this.clientList;
      return this.clientList.filter((c) =>
        c.name.toLowerCase().includes(this.searchClient.toLowerCase())
      );
    },

    selectedClientName() {
      return this.selectedClient ? this.selectedClient.name : this.searchClient;
    },

    filteredLawyerList() {
      if (!this.searchLawyer) return this.lawyerList;
      return this.lawyerList.filter((l) =>
        l.name.toLowerCase().includes(this.searchLawyer.toLowerCase())
      );
    },

    selectedLawyerName() {
      return this.selectedLawyer ? this.selectedLawyer.name : this.searchLawyer;
    },

    filteredAttendees() {
      let selectedIds = this.selectedAttendees.map((a) => a.id);

      return this.attendeeList.filter((person) => {
        return (
          !selectedIds.includes(person.id) &&
          person.name.toLowerCase().includes(this.searchAttendee.toLowerCase())
        );
      });
    },

    meetingId() {
      if (this.$route.path.includes("general-meeting")) return 3;
      if (this.$route.path.includes("client-meeting")) return 2;
      if (this.$route.path.includes("client-consultation")) return 1;
      return null;
    },

    currentMeeting() {
      return (
        meetingTypes.find((m) => m.id === this.meetingId) || meetingTypes[0]
      );
    },

    isClientMeeting() {
      return this.meetingId === 2;
    },
    isGeneralMeeting() {
      return this.meetingId === 3;
    },

    attendeeNames() {
      const clients = this.selectedClient.map((c) => c.name);
      const lawyer = this.selectedLawyer ? [this.selectedLawyer] : [];
      return [...clients, ...lawyer];
    },

    formattedAmount() {
      return this.amount ? `${this.currency} ${this.amount}` : "";
    },
  },

  created() {
    this.attendeeColors = this.attendeeList.map(() => getRandomChipColor());
    this.isGenMeeting = this.isGeneralMeeting;
  },

  mounted() {
    document.addEventListener("click", this.handleClickOutside);
    this.lawyerList = dummyLawyers;
    this.clientList = dummyLawyers; // FIX ADDED for search to work
  },

  beforeDestroy() {
    document.removeEventListener("click", this.handleClickOutside);
  },

  methods: {
    openDropdown() {
      this.showClientDropdown = true;
    },

    onSearchInput(event) {
      this.searchClient = event.target.value;

      if (
        this.selectedClient &&
        event.target.value !== this.selectedClient.name
      ) {
        this.selectedClient = null;
      }

      this.showClientDropdown = true;
    },

    selectClient(client) {
      this.selectedClient = client;
      this.searchClient = client.name;
      this.showClientDropdown = false;
    },

    openLawyerDropdown() {
      this.showLawyerDropdown = true;
    },

    onSearchLawyerInput(e) {
      const value = e.target.value;

      // If the typed value differs from selected lawyer's name, clear selection
      if (this.selectedLawyer && value !== this.selectedLawyer.name) {
        this.selectedLawyer = null;
      }

      this.searchLawyer = value;
      this.showLawyerDropdown = true;
    },

    selectLawyer(lawyer) {
      this.selectedLawyer = lawyer;
      this.searchLawyer = lawyer.name;
      this.showLawyerDropdown = false;
    },

    // FOR ATTENDEES

    openAttendeeDropdown() {
      this.showAttendeeDropdown = true;
    },

    onAttendeeSearchInput(e) {
      this.searchAttendee = e.target.value;
      this.showAttendeeDropdown = true;
    },

    selectAttendee(attendee) {
      // Prevent duplicates
      if (!this.selectedAttendees.some((a) => a.id === attendee.id)) {
        this.selectedAttendees.push(attendee);
      }
      this.searchAttendee = "";
      this.showAttendeeDropdown = true;
    },

    removeSelectedAttendee(attendee) {
      this.selectedAttendees = this.selectedAttendees.filter(
        (a) => a.id !== attendee.id
      );
    },

    isAttendeeSelected(attendee) {
      return this.selectedAttendees.some((a) => a.id === attendee.id);
    },

    toggleAttendeeSelection(attendee) {
      if (this.isAttendeeSelected(attendee)) {
        this.removeSelectedAttendee(attendee);
      } else {
        this.selectAttendee(attendee);
      }
    },

    disableBlockedDates(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const formatted = `${year}-${month}-${day}`;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return this.blockedDates.includes(formatted) || date < today;
    },

    openStartDropdown() {
      this.filteredStartTimes = this.timeSlots;
      this.showStartDropdown = true;
    },

    filterStartTimes() {
      const val = this.startTime.trim();
      this.showStartDropdown = true;

      if (!val) {
        this.filteredStartTimes = this.timeSlots;
        return;
      }

      this.filteredStartTimes = this.timeSlots.filter((t) => t.startsWith(val));
    },

    selectStartTime(t) {
      this.startTime = t;
      this.showStartDropdown = false;
    },

    openEndDropdown() {
      this.filteredEndTimes = this.timeSlots;
      this.showEndDropdown = true;
    },

    filterEndTimes() {
      const val = this.endTime.trim();
      this.showEndDropdown = true;

      if (!val) {
        this.filteredEndTimes = this.timeSlots;
        return;
      }

      this.filteredEndTimes = this.timeSlots.filter((t) => t.startsWith(val));
    },

    selectEndTime(t) {
      this.endTime = t;
      this.showEndDropdown = false;
    },

    isClientSelected(lawyer) {
      return this.selectedClient.some((c) => c.id === lawyer.id);
    },

    toggleClientSelect(lawyer) {
      if (this.isClientSelected(lawyer)) {
        this.selectedClient = this.selectedClient.filter(
          (c) => c.id !== lawyer.id
        );
      } else {
        this.selectedClient.push(lawyer);
      }
    },

    removeSelectedClient(lawyer) {
      this.selectedClient = this.selectedClient.filter(
        (c) => c.id !== lawyer.id
      );
    },

    handleClickOutside(event) {
      if (
        this.$refs.clientBox &&
        !this.$refs.clientBox.contains(event.target)
      ) {
        this.showClientDropdown = false;
      }

      if (
        this.$refs.lawyerBox &&
        !this.$refs.lawyerBox.contains(event.target)
      ) {
        this.showLawyerDropdown = false;
      }

      if (
        this.$refs.startPicker &&
        !this.$refs.startPicker.contains(event.target)
      ) {
        this.showStartDropdown = false;
      }

      if (
        this.$refs.endPicker &&
        !this.$refs.endPicker.contains(event.target)
      ) {
        this.showEndDropdown = false;
      }

      if (
        this.$refs.attendeeBox &&
        !this.$refs.attendeeBox.contains(event.target)
      ) {
        this.showAttendeeDropdown = false;
      }
    },

    validateForm() {
      const errors = {};

      if (this.isClientMeeting || this.isGeneralMeeting) {
        if (!this.meetTitle) errors.meetTitle = "Title is required";
      }

      if (this.isGeneralMeeting) {
        if (this.selectedClient.length === 0)
          errors.selectedClient = "Select at least one client";
      } else {
        if (!this.singleSelectedClient)
          errors.selectedClient = "Select a client";
      }

      if (!this.selectedLawyer) errors.selectedLawyer = "Lawyer is required";
      if (!this.appointmentDate) errors.appointmentDate = "Date required";
      if (!this.startTime) errors.startTime = "Start time required";
      if (!this.endTime) errors.endTime = "End time required";

      if (!this.isGeneralMeeting) {
        if (!this.amount) errors.amount = "Amount is required";
      }

      if (!this.isGeneralMeeting) {
        if (!this.paymentStatus) errors.paymentStatus = "Amount is required";
      }

      this.errors = errors;
      return Object.keys(errors).length === 0;
    },

    removeAttendee(attendee) {
      this.attendeeList = this.attendeeList.filter((a) => a.id !== attendee.id);

      this.selectedClient = this.selectedClient.filter(
        (c) => c.id !== attendee.id
      );

      if (attendee.id === "lawyer") {
        this.selectedLawyer = "";
      }
    },

    normalizeSingleClient() {
      if (!Array.isArray(this.selectedClient)) {
        this.selectedClient = [this.selectedClient];
      }
    },

    goNext() {
      if (!this.validateForm()) return;

      this.$router.push({
        path: "/schedule-meeting/client-consultation/mode",
        query: {
          client: this.isGeneralMeeting
            ? JSON.stringify(this.selectedClient)
            : JSON.stringify(this.singleSelectedClient),
          lawyer: JSON.stringify(this.selectedLawyer),
          title: this.meetTitle,
          date: this.appointmentDate,
          start: this.startTime,
          end: this.endTime,
          amount: `${this.currency} ${this.amount}`,
          status: this.paymentStatus,
          attendeeList: this.isGeneralMeeting
            ? JSON.stringify(this.selectedAttendees)
            : JSON.stringify([]),
          isGenMeeting: this.isGenMeeting ? "true" : "false",
        },
      });
    },
  },
};
</script>

<style scoped>
/* CALENDAR SIDEBAR */
.calendar-sidebar {
  background: white;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 32px;
}

/* --- DATEPICKER RED ROUNDED STYLING --- */

::v-deep .mx-datepicker-inline {
  width: 100% !important;
}

/* This targets the selected/active date */
::v-deep .mx-calendar-content .cell.actived {
  background-color: #a5e83f !important;
  color: green !important;
  border-radius: 50% !important;
}

/* Hover state for cells */
::v-deep .mx-calendar-content .cell:hover {
  color: green !important;
  background-color: #a5e83f !important;
  border-radius: 50% !important;
}

::v-deep .mx-calendar-content .cell.disabled {
  background-color: #fee2e2 !important;
  color: #ef4444 !important;
  border-radius: 50% !important;
  cursor: not-allowed !important;
}
::v-deep .mx-calendar-content .cell {
  color: #000000 !important;
  font-weight: 500;
  border-radius: 50% !important;
}

/* --- DATEPICKER HEADER & DAYS STYLING --- */

/* 1. Month and Year (e.g., Jan 2026) */
::v-deep .mx-calendar-header-label {
  color: #000000 !important;
  font-weight: 800 !important;
  font-size: 16px !important;
  border-radius: 50% !important;
}

::v-deep .mx-btn-icon-double-left,
::v-deep .mx-btn-icon-double-right,
::v-deep .mx-btn-icon-left,
::v-deep .mx-btn-icon-right {
  color: #000000 !important;
}

::v-deep .mx-calendar-content th {
  color: #000000 !important;
  font-weight: 700 !important;
  padding-bottom: 4px;
}

/* Today's date circle */
::v-deep .mx-calendar-content .cell.today {
  color: green !important;
  font-weight: bold;
  border-radius: 50% !important;
  font-size: 16px;
}

/* --- END DATEPICKER STYLING --- */

/* CLIENT AND LAWYER DROPDOWN AND MULTISELECT STARTS HERE  */
/* Wrapper */
.multi-select-wrapper {
  position: relative;
  width: 100%;
}

/* Search input */
.multi-select-wrapper input.meeting-schedule-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  box-sizing: border-box;
}

.multi-select-wrapper input.meeting-schedule-input:focus {
  border-color: #1976d2;
}

/* Dropdown panel */
.dropdown-panel {
  position: absolute;
  top: 48px;
  left: 0;
  width: 100%;
  max-height: 220px; /* FIXED HEIGHT */
  overflow-y: auto; /* SCROLLBAR */
  background: #ffffff;
  border: 1px solid #ccc;
  border-radius: 6px;
  z-index: 9999;
  padding: 6px 0;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
}

/* Dropdown items */
.dropdown-item {
  padding: 8px 12px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: background 0.15s ease-in-out;
}

.dropdown-item input {
  cursor: pointer;
}

.dropdown-item:hover {
  background: #f5f7fa;
}

/* .add-new-item {
  padding: 8px 12px;
  font-size: 14px;
  margin: auto !important;
  background: rgb(220, 212, 212);
  color: grey;
  cursor: pointer;
  border-top: 1px solid #ddd;
}

.add-new-item:hover {
  background: #d6ebff;
} */

.no-result {
  padding: 10px;
  text-align: center;
  color: #999;
  background: #f3f3f3;
  cursor: default;
  font-style: italic;
  opacity: 0.8;
  pointer-events: none;
}

.no-result:hover {
  background: #e0e0e0; /* no hover change */
  color: #888;
}

/* Selected chips */
.selected-chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 8px;
}

.chip {
  background: #e8eef5;
  padding: 4px 10px;
  border-radius: 14px;
  font-size: 13px;
  display: flex;
  align-items: center;
  border: 1px solid #cdd5df;
}

.chip-close {
  margin-left: 6px;
  cursor: pointer;
  font-weight: bold;
  color: #333;
}

.chip-close:hover {
  color: #d32f2f;
}

/* Error message */
.error-text {
  color: #d32f2f;
  margin-top: 4px;
  font-size: 13px;
}

/* Error border */
.error-input {
  border-color: #d32f2f !important;
}

.attendee-row {
  display: flex;
  align-items: center; /* Centers vertically */
  gap: 12px;
  margin-bottom: 12px;
}

.attendee-label {
  font-weight: 600;
  font-size: 14px;
  min-width: 90px; /* Aligns left labels consistently */
  display: flex;
  align-items: center; /* Ensures text is centered */
  height: 100%;
}

.attendee-container {
  position: relative;
  width: 100%; /* take full width of parent */
  max-width: 380px; /* slightly wider and modern */
}

/* Selected Area Box */
.selected-attendees {
  border: 1px solid #d0d7de;
  background: #f8fafc;
  border-radius: 8px;
  padding: 8px 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  cursor: text;
  min-height: 42px;
  transition: border-color 0.2s ease;
}

.selected-attendees:focus-within {
  border-color: #3b82f6; /* blue focus border */
}

/* Chips */
.attendee-chip-inline {
  display: flex;
  align-items: center;
  background: #e8f0fe;
  border: 1px solid #c9dafc;
  border-radius: 20px;
  padding: 4px 10px;
  font-size: 13px;
  color: #1f2937;
  font-weight: 500;
  gap: 6px;
  transition: background 0.2s;
}

.attendee-chip-inline:hover {
  background: #dbeafe; /* soft blue hover */
}

/* Remove icon */
.attendee-remove {
  color: #1e40af;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
}

.attendee-remove:hover {
  color: #dc2626;
}

/* Search input */
.attendee-search-input {
  border: none;
  outline: none;
  flex: 1;
  min-width: 140px;
  font-size: 14px;
  padding: 6px;
  background: transparent;
}

/* Dropdown area */
.attendee-dropdown {
  border: 1px solid #d0d7de;
  background: #ffffff;
  border-radius: 8px;
  position: absolute;
  width: 100%;
  max-height: 220px;
  overflow-y: auto;
  margin-top: 6px;
  z-index: 1000;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  animation: dropdownFade 0.2s ease-out;
}

/* Smooth fade */
@keyframes dropdownFade {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Dropdown item */
.dropdown-item {
  padding: 10px 14px;
  font-size: 14px;
  color: #111827;
  cursor: pointer;
  transition: background 0.15s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dropdown-item small {
  color: #6b7280;
  font-size: 12px;
}

.dropdown-item:hover {
  background: #f3f4f6;
  border-left: 3px solid #3b82f6; /* blue indicator */
  padding-left: 12px; /* compensate for border */
}

/* When no results */
.no-result {
  padding: 12px;
  text-align: center;
  font-style: italic;
  color: #6b7280;
}

.no-result {
  padding: 8px;
  color: #777;
}
</style>
