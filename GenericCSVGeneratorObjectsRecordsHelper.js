({
    formattingCSV : function(cmp,dataRecords,fileHeaders){
        var csvStringResult, counter, keys, columnDivider, lineDivider;
        if (dataRecords == null || !dataRecords.length) {
            return null;
        }
        columnDivider = ',';
        lineDivider =  '\n';
        keys = fileHeaders;
        csvStringResult = '';
        csvStringResult += keys.join(columnDivider);
        csvStringResult += lineDivider;
        for(var i=0; i < dataRecords.length; i++){   
            counter = 0;
            for(var sTempkey in keys) {
                var skey = keys[sTempkey] ;  
                if(counter > 0){ 
                    csvStringResult += columnDivider; 
                }   
                csvStringResult += '"'+ dataRecords[i][skey]+'"'; 
                counter++;
            } 
            csvStringResult += lineDivider;
        } 
        return csvStringResult;        
    },
})