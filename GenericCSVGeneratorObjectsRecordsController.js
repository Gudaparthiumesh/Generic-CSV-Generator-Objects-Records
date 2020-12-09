({
    doInit : function(cmp, event, helper) {
        var action = cmp.get("c.getallObjects");
        action.setCallback(this, function(response) {
            var state = response.getState();
            var ObjectName=[];
            if (state === "SUCCESS") {
                var nst=response.getReturnValue();
                for(var ns in nst){
                    if(ns=='ObjectName'){
                        for(var ts in nst[ns]){
                            ObjectName.push(nst[ns][ts]);
                        }
                    }
                }
                cmp.set("v.ObjectType",ObjectName);
            }
            else if (state === "INCOMPLETE") {
                // do something
            }
        });
        $A.enqueueAction(action);
    },
    getData : function(cmp, event, helper) {
        cmp.set('v.spinner',true);
        var getkey=cmp.find("pickedobjValue").get("v.value");
        cmp.set('v.selectedObjectName',getkey);
        var action = cmp.get("c.getResultData");
        action.setParams({"selectedObj":getkey});
        action.setCallback(this, function(response) {
            var state = response.getState();
            var res= response.getReturnValue();
            if (state === "SUCCESS") {
                if(res.length == '0'){
                    var toastEvent = $A.get("e.force:showToast");
                    var strMsg= "No Results to display with ";
                    strMsg+= getkey + " Object";
                    toastEvent.setParams({
                        "message": strMsg,
                        "type" :"warning"
                    });
                    toastEvent.fire();
                    cmp.set('v.displayAfterSelect',false);
                    cmp.set('v.spinner',false);
                    cmp.set('v.disableBtn',true);
                }
                else{
                    var cols=[];
                    var finalCol=[];
                    var rowData=[];
                    for(var i in res){
                        var key = i;
                        var val = res[i];
                        rowData.push(val);
                        for(var j in val){
                            var sub_key = j;
                            var sub_val= val[j];
                            cols.push(sub_key);
                        }
                    }
                    cols = cols.filter( function( item, index, inputArray ) {
                        return inputArray.indexOf(item) == index;
                    });
                    cols.forEach(function(element) { 
                        var colObj={};
                        colObj['label']= element;
                        colObj['fieldName']= element;
                        colObj['type']= 'text';
                        finalCol.push(colObj);
                    });
                    cmp.set('v.headerforCSV',cols);
                    cmp.set('v.headerColumns',finalCol);
                    cmp.set('v.displayAfterSelect',true);
                    cmp.set('v.spinner',false);
                    cmp.set('v.resData',rowData);
                    cmp.set('v.disableBtn',false);
                }
            }else{
                var errors = response.getError();
                var message = 'Unknown error'; // Default error message
                // Retrieve the error message sent by the server
                if (errors && Array.isArray(errors) && errors.length > 0) {
                    message = errors[0].message;
                }
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "message": message,
                    "type" :"error",
                    "duration":"2000"
                });
                toastEvent.fire();
                cmp.set('v.displayAfterSelect',false);
                cmp.set('v.spinner',false);
            }
        });
        $A.enqueueAction(action);
    },
    downloadAsCSV: function(cmp, event, hlp) {
        var resFinalData = cmp.get("v.resData");
        var headers= cmp.get("v.headerforCSV");
        var csv = hlp.formattingCSV(cmp,resFinalData,headers);   
        if (csv == null){
            return null;
        } 
        var hiddenElement = document.createElement('a');
        var expDate = $A.localizationService.formatDate(new Date(), "YYYY-MM-DD hh:mm:ss");
        var curObjName= cmp.get('v.selectedObjectName');
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
        hiddenElement.target = '_self';
        hiddenElement.download = curObjName+'_'+expDate+'.csv';  
        document.body.appendChild(hiddenElement); 
        hiddenElement.click(); 
    },
    clearData: function(cmp, event, helper) {
        cmp.set('v.spinner',true);
        setTimeout(function(){
            $A.get('e.force:refreshView').fire(); 
        }, 5000);
    },
})