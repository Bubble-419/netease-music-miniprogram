//Component Object
Component({
  properties: {
    songItem: {
      type: Object,
      value: {},
    },
  },
  data: {

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