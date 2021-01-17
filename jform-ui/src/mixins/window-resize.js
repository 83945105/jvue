export default {
  data() {
    return {
      window: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };
  },

  methods: {
    resize(e) {
      this.window = {
        width: window.innerWidth,
        height: window.innerHeight
      };
    }
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.resize)
  },

  created() {
    window.addEventListener('resize', this.resize);
  }

};
