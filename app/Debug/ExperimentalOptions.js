class ExperimentalOptions{
    async getCalendar2(debug){
        /* Free Days Class, Free Day Teachers*/
        const Calendar = await api.getCalendar().then(async (data) => {
          return data.Calendars[0].Id
        });
        const ClassCalendar = await api.getCalendar(Calendar).then(async (data) => {
          for(const elm of data.Calendar.Substitutions){
            substitution = await api.getCalendarSubstitutions(elm.Id).then(async (data) => {
              console.log(data)
            });
          }
        });
      
      }
}