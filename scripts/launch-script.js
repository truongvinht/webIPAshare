/**
 * Default jQuery ready function. It is called when the document is ready. 
 */ 
$(document).ready(function() { 
    
    //insert navigation menu
    var navigationBar =  '<div class="navbar navbar-fixed-top navbar-inverse" role="navigation"><div class="container"><div class="navbar-header"><button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse"><span class="sr-only">Toggle navigation</span><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button>';
    var topItem = '<a class="navbar-brand" href="#mainBody">Apps</a></div>';
    var collapseItems = '<div class="collapse navbar-collapse"><ul class="nav navbar-nav">';
    var endNav = '</ul></div></div></div><br><br>';
    var items = '';
    
    //list with available apps
    var appList = ["App1","App2","App3","App4"];
    for(var i=0;i < appList.length;i++){
        drawItems(appList[i]);
        items = '<li><a class="'+appList[i]+'-button" href=\"#'+appList[i]+'LINK\">'+appList[i]+'</a></li>'+items;
        
        //var button = 
        
        $('.'+appList[i]+'-button').click(function(){
           $.scrollTo($('#'+appList[i]),{duration:0}); 
        });
    }
    
    $(navigationBar+topItem+collapseItems+items+endNav).insertBefore('.nav');
    
});


function drawItems(appName){
    
    //read the data out of plist
    $.get('Apps/'+appName+'.plist',function(data){
        //printToConsole(appName);
        xmlDoc = $.parseXML(data);
        if($(xmlDoc).find('dict').length > 0){
            
            //read the last dictionary tag with all information
            tag = $(xmlDoc).find('dict').last();
            
            var keys = new Array();
            var values = new Array();
            $(tag).find('key').each(function(){
                var content = ($(this));
                keys.push($(this).text());
            });
            
            $(tag).find('string').each(function(){
                var content = ($(this));
                values.push($(this).text());
            });
            
            var title = null;
            var version = null;
            var url = null;
            var updatedAt = "";
            var whatIsNew = "";
            
            for(var i=0;i<keys.length;i++){
                //printToConsole(keys[i]+': '+values[i]);
                
                if(keys[i]=='title'){
                    title = values[i];
                    continue;
                }
                
                if(keys[i]=='bundle-version'){
                    version = values[i];
                    continue;
                }
                
                if(keys[i]=='location'){
                    url = 'href=\'itms-services://?action=download-manifest&url='+values[i]+'\'';
                    continue;
                }
                
                if(keys[i]=='news'){
                    whatIsNew = values[i];
                    continue;
                }
            }
            
            //create box
            var rowBegin = '<div class="row">';
            var itemBegin = '<div class="col-sm-8 col-md-4">';
            var thumbnail = '<div class="thumbnail"><img src=\"Apps/'+appName+'.png\"><div class="caption">';
            var headTitle = '<h2 name=\"#'+appName+'LINK\">'+title+'</h2>';
            var versionLabel = '<p><b>Version: </b>'+version+'</p>';
            var updatedLabel = '';
            if(updatedAt!=""){
                updatedLabel = '<p><b>Updated At: </b>'+updatedAt+'</p>';
            }
            var installButton = '<p><a '+url+' class="btn btn-primary" role="button">Install Application</a>';
            
            if(url==null){
                installButton = '';
            }else{
                //add download ipa button
                installButton = installButton+' <a href=\"./Apps/'+appName+'.ipa\" class="btn btn-default" role="button">Download IPA</a>'+'</p>'
            }
            
            //news
            var whatIsNewText = '';
            if(whatIsNew!=""){
                whatIsNewText = '<p><b>What\'s New:</b><br>'+whatIsNew.nl2br()+'</p>'
            }
            var divEnd = '</div>';
            var centerBox = '<div margin:0 auto;>';
            
            var content = rowBegin + itemBegin + thumbnail +  headTitle + versionLabel + updatedLabel + installButton + whatIsNewText + 
            divEnd + divEnd  + divEnd +divEnd;
            
            $(content).insertAfter('#content');
        }
    }, 'text');
    
}

String.prototype.nl2br = function()
{
    return this.replace(/\n/g, "<br />");
}

/** 
 * Prints an instance to the console (if the console is supported by the browser) 
 *  
 * @param {$} obj e.g. a jQuery object, String, Number, etc. 
 */ 
function printToConsole(obj) { 
  if(window.console) {  
    window.console.log(obj); 
  } 
}