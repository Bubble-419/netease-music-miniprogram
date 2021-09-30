//Component Object
Component({
  properties: {
    name: {
      type: String,
      value: "",
    },
    artists: {
      type: Array,
      value: [],
    },
    album: {
      type: Object,
      value: {},
    },
  },
  methods: {
    playSong: function () {
      console.log(this.properties.songItem.id);
    }
  },
  options: {
    addGlobalClass: true
  }
});