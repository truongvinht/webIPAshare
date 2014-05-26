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

    var link = document.createElement("a");
    link.href = './appList.txt';
    
    //list with available apps
    $.get(link.protocol+"//"+link.host+link.pathname+link.search+link.hash, function(data) {
        var appList = data.split(/\n/g);

        for(var i=appList.length-1;i >= 0;i--){
            drawItems(appList[i]);
            items = '<li><a class="'+appList[i]+'-button" href=\"#'+appList[i]+'\">'+appList[i]+'</a></li>'+items;
        }
        $(navigationBar+topItem+collapseItems+items+endNav).insertBefore('.nav');
    }, 'text');
    var footer = '<center><div id="footer"><div class="container-fluid"><div class="row"><div class="col-md-4"><a id="aboutMe">About</a></div><div class="col-md-4"><a href="https://www.twitter.com/truongvinht" target=_blank>Twitter</a></div><div class="col-md-4"><a href="mailto:truongvinhtATgmail.com">Mail</a></div></div></div></div><div id="AboutContent"></div></center>';
    $(footer).insertAfter('#content');
    
    $("#aboutMe").click(function(){
        alert("under construction\ncheck: twitter or email");
    });
    
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
            var rowBegin = '<center><div class="row">';
            var itemBegin = '<div class="col-sm-8 col-md-4">';
            var thumbnail = '<div class="thumbnail"><img src=\"Apps/'+appName+'.png\"><div class="caption">';
            var headTitle = '<h2 name=\"'+appName+'\">'+title+'</h2>';
            var versionLabel = '<p><b>Version: </b>'+version+'</p>';
            var updatedLabel = '';
            if(updatedAt!=""){
                updatedLabel = '<p><b>Updated At: </b>'+updatedAt+'</p>';
            }
            var installButton = '<p><a '+url+' class="btn btn-primary" role="button">Install Application</a>';

            var divEnd = '</div>';
            
            var beginBlock = rowBegin + itemBegin + thumbnail +  headTitle + versionLabel;
            var endBlock = divEnd  + divEnd +divEnd+divEnd+ '</center>'  + '</br>';
            
            if(url==null){
                installButton = '';
                $.ajax({
                    url:'./Apps/'+appName+'.plist',
                    type:'HEAD',
                    error: function()
                    {
                        //file not exists
                        printToConsole('Files incomplete for displaying');
                    },
                    success: function()
                    {
                        //file exists
                        var link = document.createElement("a");
                        link.href = './Apps/'+appName+'.plist';
                        
                        installButton = '<p><a '+'href=\'itms-services://?action=download-manifest&url='+link.protocol+"//"+link.host+link.pathname+link.search+link.hash+'\''+' class="btn btn-primary" role="button">Install Application</a>';

                        //add download ipa button
                        installButton = installButton+' <a href=\"./Apps/'+appName+'.ipa\" class="btn btn-default" role="button">Download IPA</a>'+'</p>';
                        addApplicationBlock(beginBlock,installButton,appName,whatIsNew,endBlock);
                    }
                });
            }else{
                //add download ipa button
                installButton = installButton+' <a href=\"./Apps/'+appName+'.ipa\" class="btn btn-default" role="button">Download IPA</a>'+'</p>';
                addApplicationBlock(beginBlock,installButton,appName,whatIsNew,endBlock);
            }
            
        }
    }, 'text');
    
}
function addApplicationBlock(begin,installURL,appName,text,end){
    
    if(text==""){
        var link = document.createElement("a");
        link.href = './Apps/'+appName+'.html';
        
        //not working without errors yet
        // $.ajax({
        //    url: link.protocol+"//"+link.host+link.pathname+link.search+link.hash,
        //    type: "HEAD",
        //    error: function(){
        //         var content = begin + installURL +end;
        //         $(content).insertAfter('#content');
        //    },
        //    complete: function(xhr, statusText){
        //        $.get('./Apps/'+appName+'.html', function(data) {
        //            var whatIsNewText = '<p><b>What\'s New:</b><br>'+data.nl2br()+'</p>'
        //            var content = begin + installURL+ whatIsNewText +end;
        //            $(content).insertAfter('#content');
        //        }, 'text');
        //    }
        // });
        
        var content = begin + installURL +end;
        $(content).insertAfter('#content');
    }else{
        
        //news
        var whatIsNewText = '';
        if(text!=""){
            whatIsNewText = '<p><b>What\'s New:</b><br>'+text.nl2br()+'</p>'
        }
        
        
        var content = begin + installURL+ whatIsNewText +end;
        $(content).insertAfter('#content');
    }
    
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