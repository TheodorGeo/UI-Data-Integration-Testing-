$(function(){

  var download_id = 0;

  $('#wrike_submit').on('click', function(e){

    $('#wrike_results_buttons').addClass('is-hidden-tablet');
    $('#wrike_results_buttons').addClass('is-hidden-mobile');
    e.preventDefault();


    /** Getting data from Wrike's Form **/

    var token = $("input[name='wrike_token']").val();
    var folder_name = $("input[name='wrike_folder_name']").val();

    var fields = [];
    $('#wrike_checkboxes input:checked').each(function() {
        fields.push($(this).attr('value'));
    });

    var data = {
      token,
      folder_name,
      fields
    };

    var fields_query = '';
    $.each(fields, function(index,field){
      fields_query = fields_query+'&'+field+'=true';
    });
    console.log(data);
    /** Simple Validation **/
    var validation_errors = [];

    if (data.token =="") validation_errors.push("The user's token field cannot be empty") ;
    if (data.folder_name =="") validation_errors.push("Please enter the folder's or project's name") ;
    if (data.fields.length == 0) validation_errors.push("At least one checkbox is required");

    if (validation_errors.length>0) {
      $.each(validation_errors, function(index, error){
        flash(error, {bgColor:'rgb(255, 56, 96)'});
      });
    }else{
      $('#loading_spinner').fadeIn(600);
      $.ajax({
        url: server_address+"/api/wrike/folder"+"?token="+data.token+"&name="+data.folder_name+fields_query,
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
          $('#wrike_results_buttons').removeClass('is-hidden-tablet');
          $('#wrike_results_buttons').removeClass('is-hidden-mobile');
          $('#wrike_json').text(JSON.stringify(data, undefined, 2));
          flash('You can review the generated json', {bgColor: 'rgb(0, 209, 178)'});

          $('#wrike_review').on('click', function(){
            $('#wrike_review_modal').addClass('is-active');
            $('#wrike_review_modal .modal-background').on('click', function(){
              $('#wrike_review_modal').removeClass('is-active');
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

  $('#wrike_download').on('click', function(){
    var element = document.createElement("a");
    download_id ++;
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent($('#wrike_json').text()));
    element.setAttribute('download', 'data.json');
    element.setAttribute('id', download_id);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  });

  $('#wrike_help').on('click', function(e){
    e.preventDefault();
    $('#wrike_help_modal').addClass('is-active');
    $('#wrike_help_modal .modal-background').on('click', function(){
      $('#wrike_help_modal').removeClass('is-active');
    });
  });

});
