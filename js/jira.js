$(function(){

  var download_id = 0;
  $('#jira_submit').on('click', function(e){

    $('#jira_results_buttons').addClass('is-hidden-tablet');
    $('#jira_results_buttons').addClass('is-hidden-mobile');
    e.preventDefault();

  /** Getting data from JIRA's Form **/

    var token = $("input[name='jira_token']").val();
    var project_key = $("input[name='jira_project_key']").val();
    var email = $("input[name='jira_email']").val();
    var domain = $("input[name='jira_domain']").val();

    var fields = [];
    $('#jira_checkboxes input:checked').each(function() {
        fields.push($(this).attr('value'));
    });

    var fields_query = '';
    $.each(fields, function(index,field){
      fields_query = fields_query+','+field
    });

    var data = {
      token,
      email,
      domain,
      project_key,
      fields
    };

    /** Simple Validation **/
    var validation_errors = [];

    if (data.token =="") validation_errors.push("The user's token field cannot be empty") ;
    if (data.email =="") validation_errors.push("The user's email or username field cannot be empty") ;
    if (data.domain =="") validation_errors.push("The site's name field cannot be empty") ;
    if (data.project_key =="") validation_errors.push("The project's key field cannot be empty") ;
    if (data.fields.length == 0) validation_errors.push("At least one checkbox is required");

    if (validation_errors.length>0) {
      $.each(validation_errors, function(index, error){
        flash(error, {bgColor:'rgb(255, 56, 96)'});
      });
    }else {
      $('#loading_spinner').fadeIn(600);
      $.ajax({
        url: server_address+"/api/jira/project/"+data.project_key+"?token="+data.token+"&fields="+fields_query+"&email="+data.email+"&domain="+data.domain,
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
          $('#jira_results_buttons').removeClass('is-hidden-tablet');
          $('#jira_results_buttons').removeClass('is-hidden-mobile');
          $('#jira_json').text(JSON.stringify(data, undefined, 2));
          flash('You can review the generated json', {bgColor: 'rgb(0, 209, 178)'});

          $('#jira_review').on('click', function(){
            $('#jira_review_modal').addClass('is-active');
            $('#jira_review_modal .modal-background').on('click', function(){
              $('#jira_review_modal').removeClass('is-active');
            });
          });

        }
      })
      .fail(function(data){
        $('#loading_spinner').fadeOut(600);
        flash('Ooops something went wrong ...', {bgColor:'rgb(255, 56, 96)'});
      });
    }
});

  $('#jira_download').on('click', function(){
    var element = document.createElement("a");
    download_id ++;
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent($('#jira_json').text()));
    element.setAttribute('download', 'data.json');
    element.setAttribute('id', download_id);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  });


  $('#jira_help').on('click', function(e){
    e.preventDefault();
    $('#jira_help_modal').addClass('is-active');
    $('#jira_help_modal .modal-background').on('click', function(){
      $('#jira_help_modal').removeClass('is-active');
    });
  });

});
