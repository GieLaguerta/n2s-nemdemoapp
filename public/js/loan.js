    // get value of loan
    let loanTitle = document.querySelector('.loanTitle')
    let title = document.querySelector('.title');

    let title2 = document.querySelector('.title2');

    let personal = document.querySelector('#btnPersonal').addEventListener('click', function(){
        title.innerHTML = ('Personal Loan');
    });

    let business = document.querySelector('#btnBusiness').addEventListener('click', function(){
        title.innerHTML = ('Business Loan');
    });

    let livestock = document.querySelector('#btnLivestock').addEventListener('click', function(){
        title.innerHTML = ('Livestock Loan');
    });

    let boat = document.querySelector('#btnBoatloan').addEventListener('click', function(){
        title2.innerHTML = ('Boat loan');
    });

    let tricycle = document.querySelector('#btnTricycleloan').addEventListener('click', function(){
        title2.innerHTML = ('Tricycle loan');
    });

    let sari = document.querySelector('#btnSariloan').addEventListener('click', function(){
        title2.innerHTML = ('Sari-sari Store loan');
    });

    let ret = document.querySelector('#btnRetailloan').addEventListener('click', function(){
        title2.innerHTML = ('Retail loan');
    });


    // modal
    $(document).ready(function(){
        $('.modal').modal();
    });    

    //Load footer
    $(function(){
        $("#footer").load("include/footer.html"); 
      });

    //Load navbar
    $(function(){
        $("#show").load("include/nav.html"); 
      });

    //Terms and condition
    $(function(){
        $("#terms").load("include/terms.html"); 
      });