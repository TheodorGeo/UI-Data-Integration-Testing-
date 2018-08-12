

$(function(){

  $('#loading_spinner').fadeOut(600);

  $('.tabs-buttons').on('click', function(){

    var selected_bar = $(this)[0].id;
    navigation(selected_bar);

  });
});




// Default settings

//Before start using this app change the server's address (ip or domain name)
var server_address = "http://localhost:8000";
var tabs = {
  trello_tab: {
    bool: true,
    div: 'trello'
  },
  jira_tab: {
    bool: false,
    div: 'jira'
  },
  wrike_tab: {
    bool: false,
    div: 'wrike'
  },
  asana_tab: {
    bool: false,
    div: 'asana'
  }
};

var active_bar = {
  tab_name: 'trello_tab',
  div: 'trello'
}


function navigation(selected_bar) {
  if (active_bar.tab_name !== selected_bar) {
    tabs[selected_bar].bool = true;
    tabs[active_bar.tab_name].bool = false;
    $('#'+active_bar.tab_name).removeClass('is-active');
    $('#'+active_bar.div).addClass('is-hidden-tablet');
    $('#'+active_bar.div).addClass('is-hidden-mobile');
    active_bar.tab_name = selected_bar;
    active_bar.div = tabs[selected_bar].div;
    $('#'+active_bar.tab_name).addClass('is-active');
    $('#'+active_bar.div).removeClass('is-hidden-tablet');
    $('#'+active_bar.div).removeClass('is-hidden-mobile');
  }
}
