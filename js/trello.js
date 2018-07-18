$(function(){

  var download_id = 0;

  $('#trello_submit').on('click', function(e){

    $('#trello_results_buttons').addClass('hidden');
    e.preventDefault();


    /** Getting data from Trello Form **/

    var token = $("input[name='trello_token']").val();
    var short_link = $("input[name='trello_short_link']").val();

    var fields = [];
    $('#trello_checkboxes input:checked').each(function() {
        fields.push($(this).attr('value'));
    });

    var fields_query = '';
    $.each(fields, function(index,field){
      fields_query = fields_query+','+field
    });

    console.log(fields_query);

    var data = {
      token,
      short_link,
      fields
    };

    /** Simple Validation **/
    var validation_errors = [];

    if (data.token =="") validation_errors.push("The user's token field cannot be empty") ;
    if (data.short_link =="") validation_errors.push("The board's short link field cannot be empty") ;
    if (data.fields.length == 0) validation_errors.push("At least one checkbox is required");

    if (validation_errors.length>0) {
      $.each(validation_errors, function(index, error){
        flash(error, {bgColor:'rgb(255, 56, 96)'});
      });
    }else {
      $('#loading_spinner').fadeIn(600);
      $.ajax({
        url: "http://localhost:8000/api/trello/board/shortlink/"+data.short_link+"?token="+data.token+"&fields="+fields_query,
        method: 'GET',
      })
      .done(function(data){
        $('#loading_spinner').fadeOut(600);
        if (data.errorBoolean) {
          $.each(data.messages, function(index,error){
            flash(error, {bgColor:'rgb(255, 56, 96)'});
          });
        }else {
          $('#trello_results_buttons').removeClass('hidden');
          $('#trello_json').text(JSON.stringify(data, undefined, 2));
          flash('You can review the generated json', {bgColor: 'rgb(0, 209, 178)'});

          $('#trello_review').on('click', function(){
            $('#trello_review_modal').addClass('is-active');
            $('#trello_review_modal .modal-background').on('click', function(){
              $('#trello_review_modal').removeClass('is-active');
            });
          });

        }

      })
      .fail(function(){
        flash('Ooops something went wrong ...', {bgColor:'rgb(255, 56, 96)'});
      });
    }

  })

  $('#trello_download').on('click', function(){
    var element = document.createElement("a");
    download_id ++;
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent($('#trello_json').text()));
    element.setAttribute('download', 'data.json');
    element.setAttribute('id', download_id);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  });


  $('#trello_help').on('click', function(){
    $('#trello_help_modal').addClass('is-active');
    $('#trello_help_modal .modal-background').on('click', function(){
      $('#trello_help_modal').removeClass('is-active');
    });
  });

})
