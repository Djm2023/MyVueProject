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
              <select
                v-if="!isGenMeeting"
                v-model="singleSelectedClient"
                class="meeting-schedule-input"
              >
                <option
                  v-for="lawyer in lawyerList"
                  :key="lawyer.id"
                  :value="lawyer"
                >
                  {{ lawyer.id }} - {{ lawyer.name }}
                </option>
              </select>

              <!-- <p v-if="errors.selectedClient" class="error-text">
                {{ errors.selectedClient }}
              </p> -->
              <div
                v-if="isGenMeeting"
                class="multi-select-wrapper"
                ref="clientBox"
              >
                <input
                  type="text"
                  v-model="searchClient"
                  @focus="showClientDropdown = true"
                  placeholder="Search client..."
                  :class="[
                    'meeting-schedule-input',
                    errors.selectedClient ? 'error-input' : '',
                  ]"
                />

                <div v-if="showClientDropdown" class="dropdown-panel">
                  <div
                    v-for="lawyer in filteredClientList"
                    :key="lawyer.id"
                    class="dropdown-item"
                    @click="toggleClientSelect(lawyer)"
                  >
                    <input
                      type="checkbox"
                      :checked="isClientSelected(lawyer)"
                    />
                    {{ lawyer.name }}
                  </div>

                  <div
                    v-if="searchClient && !clientExists"
                    class="dropdown-item add-new-item"
                    @click="addNewClient"
                  >
                    + Add Client: "{{ searchClient }}"
                  </div>
                </div>

                <!-- <div class="selected-chips">
                  <span
                    v-for="lawyer in selectedClient"
                    :key="lawyer.id"
                    class="chip"
                  >
                    {{ lawyer.name }}
                    <span
                      class="chip-close"
                      @click="removeSelectedClient(lawyer)"
                      >×</span
                    >
                  </span>
                </div> -->

                <p v-if="errors.selectedClient" class="error-text">
                  {{ errors.selectedClient }}
                </p>
              </div>
            </div>

            <div class="field-wrapper">
              <label class="meeting-schedule-label">Choose Lawyer</label>
              <select
                v-model="selectedLawyer"
                :class="[
                  'meeting-schedule-input',
                  errors.selectedLawyer ? 'error-input' : '',
                ]"
              >
                <option
                  v-for="lawyer in lawyerList"
                  :key="lawyer.id"
                  :value="lawyer"
                >
                  {{ lawyer.id }} - {{ lawyer.name }}
                </option>
              </select>
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
            <span class="attendee-value">
              <span
                v-for="(person, index) in attendeeList"
                :key="index"
                class="attendee-chip-inline"
                :style="{ backgroundColor: attendeeColors[index] }"
              >
                {{ person.name }}
                <span class="attendee-remove" @click="removeAttendee(person)"
                  >×</span
                >
              </span>
            </span>
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
      meetTitle: "",
      isGenMeeting: false,
      // MULTISELECT UPDATED
      selectedClient: [], // was string, now array
      searchClient: "",
      showClientDropdown: false,

      singleSelectedClient: null,

      selectedLawyer: "",
      appointmentDate: "",
      startTime: "",
      endTime: "",
      paymentStatus: "",
      // amount: "",
      errors: {},

      lawyerList: dummyLawyers,

      blockedDates: ["2026-01-20", "2026-01-22", "2026-01-25"],

      attendeeList: [],
      attendeeColors: [],

      startDisplay: "",
      endDisplay: "",
      showStartDropdown: false,
      showEndDropdown: false,

      currency: "Rs",
      amount: "",

      timeSlots: Array.from({ length: 48 }, (_, i) => {
        const hour = String(Math.floor(i / 2)).padStart(2, "0");
        const minute = i % 2 === 0 ? "00" : "30";
        return `${hour}:${minute}`;
      }),
    };
  },

  // watch: {
  //   isGeneralMeeting(newVal) {
  //     this.isGenMeeting = newVal;
  //   },
  //   selectedClient: {
  //     handler(newClients) {
  //       const lawyerObject = this.selectedLawyer
  //         ? { id: "lawyer", name: this.selectedLawyer }
  //         : null;

  //       this.attendeeList = [
  //         ...newClients.map((c) => ({ id: c.id, name: c.name })),
  //         ...(lawyerObject ? [lawyerObject] : []),
  //       ];
  //     },
  //     deep: true,
  //   },

  //   selectedLawyer(newVal) {
  //     const lawyerObject = newVal ? { id: "lawyer", name: newVal } : null;

  //     this.attendeeList = [
  //       ...this.selectedClient.map((c) => ({ id: c.id, name: c.name })),
  //       ...(lawyerObject ? [lawyerObject] : []),
  //     ];
  //   },
  //   attendeeList: {
  //     handler(newVal) {
  //       this.attendeeColors = newVal.map(() => getRandomChipColor());
  //     },
  //     deep: true,
  //   },
  // },

  watch: {
    isGeneralMeeting(newVal) {
      this.isGenMeeting = newVal;
    },

    // Multi-Select Mode (General Meeting)
    selectedClient: {
      handler(newClients) {
        if (!this.isGeneralMeeting) return; // skip in single-select mode

        const list = Array.isArray(newClients) ? newClients : [];

        const lawyerObject = this.selectedLawyer
          ? {
              id: "lawyer",
              name: this.selectedLawyer.name || this.selectedLawyer,
            }
          : null;

        this.attendeeList = [
          ...list.map((c) => ({ id: c.id, name: c.name })),
          ...(lawyerObject ? [lawyerObject] : []),
        ];
      },
      deep: true,
    },

    // Single-Select Mode (Non-General Meeting)
    singleSelectedClient(newVal) {
      if (this.isGeneralMeeting) return;

      const lawyerObject = this.selectedLawyer
        ? {
            id: "lawyer",
            name: this.selectedLawyer.name || this.selectedLawyer,
          }
        : null;

      this.attendeeList = newVal
        ? [
            { id: newVal.id, name: newVal.name },
            ...(lawyerObject ? [lawyerObject] : []),
          ]
        : [...(lawyerObject ? [lawyerObject] : [])];
    },

    // Lawyer watcher works for both modes
    selectedLawyer(newVal) {
      const lawyerObject = newVal
        ? { id: "lawyer", name: newVal.name || newVal }
        : null;

      if (this.isGeneralMeeting) {
        this.attendeeList = [
          ...this.selectedClient.map((c) => ({ id: c.id, name: c.name })),
          ...(lawyerObject ? [lawyerObject] : []),
        ];
      } else {
        this.attendeeList = this.singleSelectedClient
          ? [
              {
                id: this.singleSelectedClient.id,
                name: this.singleSelectedClient.name,
              },
              ...(lawyerObject ? [lawyerObject] : []),
            ]
          : [...(lawyerObject ? [lawyerObject] : [])];
      }
    },

    attendeeList(newVal) {
      this.attendeeColors = newVal.map(() => getRandomChipColor());
    },
  },
  computed: {
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

    // FOR ATTENDEE LIST
    attendeeNames() {
      const clients = this.selectedClient.map((c) => c.name);
      const lawyer = this.selectedLawyer ? [this.selectedLawyer] : [];

      return [...clients, ...lawyer];
    },

    // MULTISELECT FILTERING
    filteredClientList() {
      const q = this.searchClient.toLowerCase();
      return this.lawyerList.filter((l) => l.name.toLowerCase().includes(q));
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
  },

  beforeDestroy() {
    document.removeEventListener("click", this.handleClickOutside);
  },

  methods: {
    disableBlockedDates(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const formatted = `${year}-${month}-${day}`;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return this.blockedDates.includes(formatted) || date < today;
    },

    validateStartTime() {
      if (!/^\d{0,2}:?\d{0,2}$/.test(this.startTime)) return;

      if (this.startTime.length === 5 && /^\d{2}:\d{2}$/.test(this.startTime)) {
        const [h, m] = this.startTime.split(":");
        if (+h <= 23 && +m <= 59) return;
      }
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

    /* ---------------- MULTISELECT LOGIC ---------------- */

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

      // Update validation
      if (this.selectedClient.length === 0) {
        this.errors.selectedClient = "Client is required";
      } else {
        this.errors.selectedClient = "";
      }
    },

    removeSelectedClient(lawyer) {
      this.selectedClient = this.selectedClient.filter(
        (c) => c.id !== lawyer.id
      );

      if (this.selectedClient.length === 0) {
        this.errors.selectedClient = "Client is required";
      }
    },

    /* ---------------- CLICK OUTSIDE TO CLOSE ---------------- */

    handleClickOutside(event) {
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

      // Close client dropdown
      if (
        this.$refs.clientBox &&
        !this.$refs.clientBox.contains(event.target)
      ) {
        this.showClientDropdown = false;
      }
    },

    /* ---------------- VALIDATION ---------------- */

    validateForm() {
      const errors = {};

      if (this.isClientMeeting || this.isGeneralMeeting) {
        if (!this.meetTitle) errors.meetTitle = "Title is required";
      }

      // Updated for array
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

      // if (!this.paymentStatus) errors.paymentStatus = "Select payment status";

      this.errors = errors;
      return Object.keys(errors).length === 0;
    },

    /* ADD CLIENT  */
    addNewClient() {
      const newClient = {
        id: Date.now(), // unique ID
        name: this.searchClient.trim(),
      };

      // Add to list
      this.lawyerList.push(newClient);

      // Select it
      this.selectedClient.push(newClient);

      // Clear field
      this.searchClient = "";
      this.showClientDropdown = false;

      // Clear errors if existed
      this.errors.selectedClient = "";
    },

    // REMOVE ATTENDEE

    removeAttendee(attendee) {
      // Remove from attendeeList
      this.attendeeList = this.attendeeList.filter((a) => a.id !== attendee.id);

      // If removing a client
      this.selectedClient = this.selectedClient.filter(
        (c) => c.id !== attendee.id
      );

      // If removing lawyer
      if (attendee.id === "lawyer") {
        this.selectedLawyer = "";
      }
    },
    /* ---------------- NEXT PAGE ---------------- */

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
          attendeeList: this.attendeeList,
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

/* Empty result message */
.no-result {
  padding: 10px;
  text-align: center;
  color: #777;
}

.add-new-item {
  padding: 8px 12px;
  font-size: 14px;
  background: #e8f4ff;
  color: #005dbb;
  cursor: pointer;
  border-top: 1px solid #ddd;
}

.add-new-item:hover {
  background: #d6ebff;
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
</style>
