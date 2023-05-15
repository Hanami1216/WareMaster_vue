<template>
  <div class="user-profile">
    <div class="welcome-message">
      <h1>Welcome back, {{ this.$store.getters.name }}!</h1>
      <p>Here is your user profile</p>
    </div>
    <div class="time-block">
      <span class="date">{{ currentDate }}</span>
      <span class="time">{{ currentTime }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserProfile',
  data() {
    return {
      userName: 'John Doe',
      timeInterval: null,
      currentTime: new Date().toLocaleString(),
      currentDate: new Date().toLocaleDateString()
    }
  },
  mounted() {
    this.timeInterval = setInterval(() => {
      this.updateTime()
    }, 1000)
  },
  beforeDestroy() {
    clearInterval(this.timeInterval)
  },
  methods: {
    updateTime() {
      this.currentTime = new Date().toLocaleString()
      this.currentDate = new Date().toLocaleDateString()
    }
  }
}
</script>

<style>
.user-profile {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 32px;
}

.welcome-message {
  text-align: center;
  margin-bottom: 32px;
}

.welcome-message h1 {
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 16px;
}

.welcome-message p {
  font-size: 24px;
}

.time-block {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.time {
  font-size: 96px;
  font-weight: bold;
  margin-bottom: 8px;
}

.date {
  font-size: 24px;
}
</style>
