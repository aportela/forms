const template = function () {
    return `
        <div class="field has-addons">
            <div class="control has-icons-left has-icons-left is-expanded">
                <div class="select">
                    <select v-bind:disabled="disabled" v-model.number="selected" v-on:change="onChange">
                        <option value="0">Any date</option>
                        <option value="1">Today</option>
                        <option value="2">Yesterday</option>
                        <option value="3">This week</option>
                        <option value="4">Last week</option>
                        <option value="5">This month</option>
                        <option value="6">Last month</option>
                        <option value="7">This year</option>
                        <option value="8">Last year</option>
                        <option value="9" disabled>Between dates</option>
                    </select>
                </div>
                <span class="icon is-small is-left">
                    <i class="fas fa-filter"></i>
                </span >
            </div>
            <div class="control">
                <button type="button" class="button" v-bind:disabled="disabled" v-on:click.prevent="$emit('searchTriggered', text)">
                    <span class="icon">
                        <i class="fas fa-search"></i>
                    </span>
                </button>
            </div>
        </div>
    `;
};

export default {
    name: 'f-field-date-search',
    template: template(),
    data: function () {
        return ({
            selected: 0,
            dates: {
                from: null,
                to: null
            }
        });
    },
    props: [
        'disabled'
    ],
    methods: {
        setDateHoursStartDay(date) {
            date = dateFns.setHours(date, 0);
            date = dateFns.setMinutes(date, 0);
            date = dateFns.setSeconds(date, 0);
            date = dateFns.setMilliseconds(date, 0);
            return (date);
        },
        setDateHoursFinishDay(date) {
            date = dateFns.setHours(date, 23);
            date = dateFns.setMinutes(date, 59);
            date = dateFns.setSeconds(date, 59);
            date = dateFns.setMilliseconds(date, 999);
            return (date);
        },
        changeDate: function (date, daysChanged, monthsChanged, yearsChanged) {
            date = dateFns.addDays(date, daysChanged);
            date = dateFns.addMonths(date, monthsChanged);
            date = dateFns.addYears(date, yearsChanged);
            return (date);
        },
        onChange: function () {
            let todayDate = new Date();
            switch (this.selected) {
                // any date
                case 0:
                    this.dates.from = null;
                    this.dates.to = null;
                    break;
                // today
                case 1:
                    this.dates.from = this.setDateHoursStartDay(todayDate).toJSON();
                    this.dates.to = this.setDateHoursFinishDay(this.changeDate(todayDate, 0, 0, 0)).toJSON();
                    break;
                // yesterday
                case 2:
                    this.dates.from = this.setDateHoursStartDay(this.changeDate(todayDate, -1, 0, 0)).toJSON();
                    this.dates.to = this.setDateHoursFinishDay(this.changeDate(todayDate, -1, 0, 0)).toJSON();
                    break;
                // this week
                case 3:
                    // wrong: TODO - > get days difference to week start day
                    this.dates.from = this.setDateHoursStartDay(this.changeDate(todayDate, (dateFns.getISODay(todayDate) * -1), 0, 0)).toJSON();
                    this.dates.to = this.setDateHoursFinishDay(this.changeDate(todayDate, 0, 0, 0)).toJSON();
                    break;
                // last week (today - 7)
                case 4:
                    this.dates.from = this.setDateHoursStartDay(this.changeDate(todayDate, -6, 0, 0)).toJSON();
                    this.dates.to = this.setDateHoursFinishDay(this.changeDate(todayDate, 0, 0, 0)).toJSON();
                    break;
                // this month
                case 5:
                    // wrong: TODO - > get days difference to month start day
                    this.dates.from = this.setDateHoursStartDay(this.changeDate(todayDate, -31, 0, 0)).toJSON();
                    this.dates.to = this.setDateHoursFinishDay(this.changeDate(todayDate, 0, 0, 0)).toJSON();
                    break;
                // last month (today - 1 month)
                case 6:
                    this.dates.from = this.setDateHoursStartDay(this.changeDate(todayDate, 0, -1, 0)).toJSON();
                    this.dates.to = this.setDateHoursFinishDay(this.changeDate(todayDate, 0, 0, 0)).toJSON();
                    break;
                // this year
                case 7:
                    // wrong: TODO - > get days difference to year start day
                    this.dates.from = this.setDateHoursStartDay(this.changeDate(todayDate, 0, 0, -1)).toJSON();
                    this.dates.to = this.setDateHoursFinishDay(this.changeDate(todayDate, 0, 0, 0)).toJSON();
                    break;
                // last year (today - 1 year)
                case 8:
                    this.dates.from = this.setDateHoursStartDay(this.changeDate(todayDate, 0, 0, -1)).toJSON();
                    this.dates.to = this.setDateHoursFinishDay(this.changeDate(todayDate, 0, 0, 0)).toJSON();
                    break;
                // between dates (TODO)
                case 9:
                    this.dates.from = null;
                    this.dates.to = null;
                    break;
            }
        }
    }
}