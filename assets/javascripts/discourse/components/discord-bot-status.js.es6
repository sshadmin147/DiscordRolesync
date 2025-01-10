import { cancel, later, next } from "@ember/runloop";
import { ajax } from "discourse/lib/ajax";

export default Ember.Component.extend({
  poller: null,
  didInsertElement() {
    next(this, () => {
      this.poller = this.pollBotStats();
    });
  },
  willDestroyElement() {
    cancel(this.poller);
  },
  pollBotStats() {
    return later(
      this,
      () => {
        ajax("/discord-rolesync/botstats", { type: "GET" }).then((a) => {
          this.set("current_action", a.current_action);
          this.set("botstats", a.botstats);
          this.poller = this.pollBotStats();
        });
      },
      1000
    );
  },
});
