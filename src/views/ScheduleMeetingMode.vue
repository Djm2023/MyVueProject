<template>
  <div class="meeting-mode-wrapper">
    <!-- HEADER -->
    <div class="meeting-mode-header">
      <h1>Schedule Consultation</h1>
      <p>Book your legal consultation meeting</p>
    </div>

    <div class="meeting-mode-container">
      <!-- LEFT FORM -->
      <div class="meeting-mode-card">
        <h2 class="card-title">Mode of Meeting/Consultation</h2>

        <!-- MODE BUTTONS -->
        <div class="mode-buttons">
          <button
            @click="form.mode = 'phone'"
            :class="['mode-btn', form.mode === 'phone' ? 'active' : '']"
          >
            Phone
          </button>

          <button
            @click="form.mode = 'video'"
            :class="['mode-btn', form.mode === 'video' ? 'active' : '']"
          >
            Video Call
          </button>

          <button
            @click="form.mode = 'in-person'"
            :class="['mode-btn', form.mode === 'in-person' ? 'active' : '']"
          >
            In Person
          </button>
        </div>

        <!-- PHONE -->
        <div v-if="form.mode === 'phone'" class="form-section">
          <div>
            <label class="form-label">Call at *</label>
            <textarea
              v-model="form.callAt"
              rows="2"
              class="form-input"
              readonly
            ></textarea>
          </div>

          <div>
            <label class="form-label">Message</label>
            <textarea
              v-model="form.message"
              rows="3"
              class="form-input"
              readonly
            ></textarea>
          </div>
        </div>

        <!-- VIDEO -->
        <div v-else-if="form.mode === 'video'" class="form-section">
          <div>
            <label class="form-label">Meeting Link *</label>
            <textarea
              v-model="form.meetingLink"
              rows="4"
              placeholder="https://meet.google.com/..."
              class="form-input"
            ></textarea>
          </div>

          <div>
            <label class="form-label">Message</label>
            <textarea
              v-model="form.message"
              rows="3"
              class="form-input"
              readonly
            ></textarea>
          </div>
        </div>

        <!-- IN PERSON -->
        <div v-else class="form-section">
          <div>
            <label class="radio-label">
              <input type="radio" value="lawyer" v-model="form.addressType" />
              <span>Lawyer Address *</span>
            </label>
            <textarea
              v-model="form.lawyerAddress"
              rows="4"
              class="form-input"
              :disabled="form.addressType !== 'lawyer'"
            ></textarea>
          </div>

          <div>
            <label class="radio-label">
              <input
                type="radio"
                value="alternate"
                v-model="form.addressType"
              />
              <span>Alternate Address</span>
            </label>
            <textarea
              v-model="form.alternateAddress"
              rows="4"
              class="form-input"
              :disabled="form.addressType !== 'alternate'"
            ></textarea>
          </div>

          <div>
            <label class="form-label">Message</label>
            <textarea
              v-model="form.message"
              rows="3"
              class="form-input"
              readonly
            ></textarea>
          </div>
        </div>
      </div>

      <!-- RIGHT SUMMARY -->
      <div class="summary-card-mini">
        <h3 class="summary-heading">Consultation Summary</h3>

        <div class="summary-grid">
          <div v-if="form.isGeneralMeeting" class="item">
            <span class="label">Title</span>
            <span class="value">{{ form.title || "—" }}</span>
          </div>

          <div class="item">
            <span class="label">Client</span>
            <span class="value">{{ form.clientName || "—" }}</span>
          </div>

          <div class="item">
            <span class="label">Lawyer</span>
            <span class="value">{{ form.lawyerName.name || "—" }}</span>
          </div>

          <div class="item">
            <span class="label">Date</span>
            <span class="value">{{ form.date || "—" }}</span>
          </div>

          <div class="item">
            <span class="label">Time</span>
            <span class="value"
              >{{ form.startTime || "—" }} - {{ form.endTime || "—" }}</span
            >
          </div>

          <div v-if="!form.isGeneralMeeting" class="item">
            <span class="label">Amount</span>
            <span class="value"> {{ form.fees || "—" }}</span>
          </div>

          <div v-if="!form.isGeneralMeeting" class="item">
            <span class="label">Status</span>
            <span
              :class="['status-chip', getPaymentChipClass(form.paymentStatus)]"
            >
              {{ form.paymentStatus || "—" }}
            </span>
          </div>

          <div class="item">
            <span class="label">Mode</span>
            <span class="value capitalize">{{ form.mode }}</span>
          </div>
        </div>

        <div class="summary-actions-mini">
          <button class="btn-outline" @click="$router.back()">Back</button>
          <button class="btn-primary" @click="showReviewModal = true">
            Next
          </button>
        </div>
      </div>
    </div>

    <div v-if="showReviewModal" class="modal-overlay">
      <div class="modal-content">
        <!-- Close Button -->
        <button class="modal-close" @click="showReviewModal = false">X</button>

        <!-- Heading -->
        <h2 class="modal-title">Review and Confirm</h2>

        <!-- Body -->
        <div class="modal-body">
          <div v-if="form.isGeneralMeeting" class="modal-row">
            <strong>Title : </strong> {{ form.title }}
          </div>

          <div class="modal-row">
            <strong>Client : </strong> {{ form.clientName }}
          </div>
          <div class="modal-row">
            <strong>Lawyer : </strong> {{ form.lawyerName.name }}
          </div>
          <div class="modal-row"><strong>Date:</strong> {{ form.date }}</div>
          <div class="modal-row">
            <strong>Time : </strong> {{ form.startTime }} - {{ form.endTime }}
          </div>
          <div v-if="!form.isGeneralMeeting" class="modal-row">
            <strong>Amount : </strong> {{ form.fees }}
          </div>
          <div v-if="!form.isGeneralMeeting" class="modal-row">
            <strong>Payment Status : </strong>

            <span
              :class="['status-chip', getPaymentChipClass(form.paymentStatus)]"
            >
              {{ form.paymentStatus || "—" }}
            </span>
          </div>

          <div class="modal-row"><strong>Mode : </strong> {{ form.mode }}</div>
        </div>

        <!-- Buttons -->
        <div class="modal-actions">
          <button class="modal-confirm-btn" @click="confirmBooking">
            Review and Confirm
          </button>
        </div>
      </div>
    </div>

    <!-- SUCCESS MODAL -->
    <div v-if="showSuccessModal" class="modal-overlay">
      <div class="modal-content success-modal">
        <!-- Success Icon -->
        <div class="success-header">
          <div class="success-icon">✓</div>
          <h2>Success</h2>
        </div>

        <!-- Message -->
        <p class="success-message">Meeting scheduled successfully.</p>

        <!-- OK Button -->
        <div class="modal-actions">
          <button class="modal-confirm-btn" @click="closeSuccessModal">
            OK
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/styles/ScheduleMeetingMode.css";
import { getPaymentChipClass } from "../utils/paymentChip";

export default {
  name: "ScheduleMeetingMode",

  data() {
    return {
      SUPPORT_NUMBER: "+91 7604047602",

      // Modal visibility flag
      showReviewModal: false,
      showSuccessModal: false,

      // Existing form data (unchanged)
      form: {
        mode: "phone",
        title: "",
        clientName: "",
        lawyerName: "",
        date: "",
        startTime: "",
        endTime: "",
        fees: 0,
        callAt: "+91 9902113552",
        meetingLink: "",
        addressType: "lawyer",
        lawyerAddress: "",
        alternateAddress: "",
        message: "",
        paymentStatus: "",
        isGeneralMeeting: false,
      },
    };
  },

  // ADD THIS PART – It was missing and causing modal not to reopen
  methods: {
    getPaymentChipClass,
    confirmBooking() {
      // Close review modal
      this.showReviewModal = false;

      console.log("All form =>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",this.form )

      // Open success modal after slight delay
      setTimeout(() => {
        this.showSuccessModal = true;
      }, 200);
    },

    closeSuccessModal() {
      this.showSuccessModal = false;
    },
  },

  created() {
    const q = this.$route.query;

    if (q.client) {
      try {
        const parsedClient = JSON.parse(q.client);

        if (Array.isArray(parsedClient)) {
          // Extract only names
          this.form.clientName = parsedClient.map((c) => c.name).join(", ");
        } else {
          this.form.clientName = parsedClient.name || "";
        }
      } catch (err) {
        // If client is not JSON, use as is
        this.form.clientName = q.client;
      }
    }

    if (q.lawyer) {
      try {
        const parsedLawyer = JSON.parse(q.lawyer);
        this.form.lawyerName = parsedLawyer; // Store full object

        if (parsedLawyer.address) {
          this.form.lawyerAddress = parsedLawyer.address;
        }
      } catch (err) {
        this.form.lawyerName = { name: q.lawyer }; // fallback object
      }
    }

    this.form.date = q.date || "";
    this.form.startTime = q.start || "";
    this.form.endTime = q.end || "";
    this.form.fees = q.amount || "";
    this.form.paymentStatus = q.status || "";
    this.form.title = q.title || "";
    this.form.isGeneralMeeting = q.isGenMeeting === "true";

    this.form.message = `In case you are not able to connect call at ${this.SUPPORT_NUMBER}`;
  },

  watch: {
    "form.mode"(mode) {
      if (mode === "phone") {
        this.form.callAt = "+91 9902113552";
      }

      if (mode === "video") {
        this.form.meetingLink = "";
      }

      if (mode === "in-person") {
        this.form.addressType = "lawyer";
        this.form.lawyerAddress = "";
        this.form.alternateAddress = "";
      }

      this.form.message = `In case you are not able to connect call at ${this.SUPPORT_NUMBER}`;
    },
  },
};
</script>
