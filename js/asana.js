$(function(){

  var download_id = 0;
  $('#asana_submit').on('click', function(e){

    $('#asana_results_buttons').addClass('is-hidden-tablet');
    $('#asana_results_buttons').addClass('is-hidden-mobile');
    e.preventDefault();

    /** Getting data from JIRA's Form **/

    var token = $("input[name='asana_token']").val();
    var project_id = $("input[name='asana_project_id']").val();

    var fields = [];
    $('#asana_checkboxes input:checked').each(function() {
        fields.push($(this).attr('value'));
    });

    var fields_query = '';
    $.each(fields, function(index,field){
      if(fields_query === ''){
        fields_query = field ;
      }else{
        fields_query = fields_query+','+field ;
      }

    });

    var data = {
      token,
      project_id,
      fields
    };
    console.log(fields_query);

    /** Simple Validation **/
    var validation_errors = [];

    if (data.token =="") validation_errors.push("The user's token field cannot be empty") ;
    if (data.project_id =="") validation_errors.push("The project's id field cannot be empty") ;
    if (data.fields.length == 0) validation_errors.push("At least one checkbox is required");

    if (validation_errors.length>0) {
      $.each(validation_errors, function(index, error){
        flash(error, {bgColor:'rgb(255, 56, 96)'});
      });
    }else {
      $('#loading_spinner').fadeIn(600);
      $.ajax({
        url: server_address+"/api/asana/project/"+data.project_id+"?token="+data.token+"&fields="+fields_query,
        method: 'GET',
      })
      .done(function(data){
        $('#loading_spinner').fadeOut(600);
        if (data.errorBoolean) {
          var temp = data.messages[0];
          $.each(data.messages, function(index,error){
            if (temp == error) {
              flash(error, {bgColor:'rgb(255, 56, 96)'});
              temp = null;
            }
          });
        }else {
          $('#asana_results_buttons').removeClass('is-hidden-tablet');
          $('#asana_results_buttons').removeClass('is-hidden-mobile');
          $('#asana_json').text(JSON.stringify(data, undefined, 2));
          flash('You can review the generated json', {bgColor: 'rgb(0, 209, 178)'});

          $('#asana_review').on('click', function(){
            $('#asana_review_modal').addClass('is-active');
            $('#asana_review_modal .modal-background').on('click', function(){
              $('#asana_review_modal').removeClass('is-active');
            });
          });

        }
      })
      .fail(function(e,d){
        $('#loading_spinner').fadeOut(600);
        flash('Ooops something went wrong ...', {bgColor:'rgb(255, 56, 96)'});
      });
    }

  });

  $('#asana_download').on('click', function(){
    var element = document.createElement("a");
    download_id ++;
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent($('#asana_json').text()));
    element.setAttribute('download', 'data.json');
    element.setAttribute('id', download_id);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  });

  $('#asana_help').on('click', function(e){
    e.preventDefault();
    $('#asana_help_modal').addClass('is-active');
    $('#asana_help_modal .modal-background').on('click', function(){
      $('#asana_help_modal').removeClass('is-active');
    });
  });

});
