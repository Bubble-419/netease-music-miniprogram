//Component Object
Component({
  properties: {
    itemId: {
      type: Number,
      value: 0
    },
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
    border: {
      type: Boolean,
      value: true,
    },
    playlistItem: {
      type: Boolean,
      value: false,
    },
    tag: '',
  },
  methods: {
    playSong: function () {
      console.log(this.properties.itemId);
      wx.navigateTo({
        url: '../playSong/playSong?ids=' + this.properties.itemId,
      });
    }
  },
  options: {
    addGlobalClass: true
  }
});