const postIDTest = "1612586125439813";
var csvString = "";


 function exportToCSV(){
    var blobdata = new Blob([csvString],{type : 'text/csv'});
    var link = document.createElement("a");
    link.setAttribute("href", window.URL.createObjectURL(blobdata));
    link.setAttribute("download", "votos.csv");
    document.body.appendChild(link);
    link.click();
  }
  
$(document).ready(function(){
  $('#computar').on('click',function(){
    var id = $("#postId").val();
    console.log(id);
      $.get('https://graph.facebook.com/'+id+'?fields=comments.limit(5000){from,message}&access_token=1372692302809557|ca811d87d13e6d9df7f675ef0cf56ea0',function(data){
        var s = computar(data.comments);
        $('#tabela-body').html(s);
        $('#computado').css('display','block');
      });
    });
  
  
  
  function computar(comments){
    var elegiveis = createElegiveis(comments);
    csvString = "nome,voto";
    var votes = [];
    var tableString = "";
    elegiveis.forEach(function(x){
      votes.push(voteFor(x,comments));
    });
    
    votes.sort(function(a,b){
      return b.votes - a.votes;
    })
    var count = 1;
    votes.forEach(function(x){
      if(x.votes < 1)
        return;
      count++;
      tableString += `
           <tr>
              <th>`+count+`</th>
              <td>`+x.elegivel+`</td>
              <td>`+x.votes+`</td>
            </tr>
      `
      csvString += "\n" + x.elegivel+ ","+x.votes;
    });
    
    return tableString;
  }
  
  function createElegiveis(comments){
    var data = comments.data;
    var elegiveis = [];
    for(var i =0; i < data.length;i++){
      if(data[i].message.toLowerCase().indexOf(data[i].from.name.toLowerCase()) !== -1){
        elegiveis.push(data[i].from.name.toLowerCase());
      }
    }
    return elegiveis;
  }
  
  function voteFor(elegivel, comments){
    var data = comments.data;
    var count = 0;
    for(var i =0; i < data.length; i++){
      if(data[i].message.toLowerCase().lastIndexOf(elegivel,0) === 0 && data[i].from.name.toLowerCase().indexOf(elegivel) === -1){
        count++;  
      }
    }
    return { elegivel: elegivel, votes: count};
  }
    
    
    
});