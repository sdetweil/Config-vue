<template>
  <Header :info="info" :data="data"></Header>
  <Content :info="info" :data="data"></Content>
  <Footer @changepage="changepage"></Footer>
</template>

<script>
import Footer from "../components/FooterComponent.vue";
import Header from "../components/HeaderComponent.vue";
import Content from "../components/ContentComponent.vue";

export default {
  name: "Slide",
  components: { Footer, Header, Content },
  emits: ["changepage"],

  methods: {
    changepage(direction) {
      console.log("received change page event, direction=" + direction);
      this.$emit("changepage", direction);
    }
  },

  props: {
    // layout of the field descriptions
    info: {
      type: Object,
      name: {
        type: String,
        default: function() {
          return "Sample";
        }
      },
      fields: {
        type: Array,
        default: function() {
          return [{ Name: "Test", width: 10 }];
        }
      }
    },

    // slide data
    data: {
      type: Object,
      default: function() {
        return {};
      }
    }
  }
};
</script>
