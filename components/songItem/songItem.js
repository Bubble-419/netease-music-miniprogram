//Component Object
Component({
  properties: {
    index: {
      type: Number,
      value: 0
    },
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
    playlistItem: {
      type: Boolean,
      value: false,
    }
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