    // gender
    document.addEventListener('DOMContentLoaded', function() {
        var elems = document.querySelectorAll('select');
        var instances = M.FormSelect.init(elems, options);
      });
    
      // Or with jQuery
    
      $(document).ready(function(){
        $('select').formSelect();
      });
      
    //   datepicker
        document.addEventListener('DOMContentLoaded', function() {
        var elems = document.querySelectorAll('.datepicker');
        var instances = M.Datepicker.init(elems, options);
      });
    
      // Or with jQuery
    
      $(document).ready(function(){
        $('.datepicker').datepicker();
      });

      //show footer

