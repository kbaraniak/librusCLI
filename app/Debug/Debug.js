class Debug{
    __debugData(data){
        let sep = "==================================";
        console.log("Debugging Data:");
        console.log(
          strings.italic(
            "If you want to support the project, copy the data between '=' and create a new issue"
          )
        );
        console.log(
          strings.italic(
            strings.bold(
              "New Issue: https://github.com/kbaraniak/librusCLI/issues/new/choose"
            )
          )
        );
        console.log(sep);
        console.log(data);
        console.log(sep);
      }
}
