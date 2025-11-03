<script>
function updateKPI(data){
  totalCount.textContent=data.length;
  scheduledCount.textContent=data.filter(d=>d.Results?.toLowerCase().includes('scheduled')).length;
  pendingCount.textContent=data.filter(d=>d.Results?.toLowerCase().includes('pending')).length;
  notSuitableCount.textContent=data.filter(d=>d.Results?.toLowerCase().includes('not')).length;
  withdrawnCount.textContent=data.filter(d=>d.Results?.toLowerCase().includes('withdrawn')).length;
  noShowCount.textContent=data.filter(d=>d.Results?.toLowerCase().includes('no show')).length;
}

function populateFilters(data){
  [...new Set(data.map(d=>d.Position))].forEach(v=>positionFilter.innerHTML+=`<option>${v}</option>`);
  [...new Set(data.map(d=>d.Company))].forEach(v=>companyFilter.innerHTML+=`<option>${v}</option>`);
  [...new Set(data.map(d=>d.Results))].forEach(v=>resultFilter.innerHTML+=`<option>${v}</option>`);
}

function renderTable(data){
  const tbody=document.querySelector('#dataTable tbody');tbody.innerHTML='';
  data.forEach(r=>{
    const tr=document.createElement('tr');
    tr.innerHTML=`<td>${r["Applicant's Name"]}</td><td>${r["Applied through"]}</td><td>${r.Position}</td>
    <td>${r["Interview Date"]}</td><td>${r.Time}</td><td>${r.Interviewer}</td>
    <td>${r.Results}</td><td>${r["Join Date"]}</td><td>${r.Company}</td>`;
    tbody.appendChild(tr);
  });
}

function applyFilters(){
  let d=window.allData;
  const pos=positionFilter.value,comp=companyFilter.value,res=resultFilter.value,search=searchBox.value.toLowerCase();
  const from=dateFrom.value,to=dateTo.value;
  d=d.filter(x=>
    (!pos||x.Position===pos)&&(!comp||x.Company===comp)&&(!res||x.Results===res)&&
    (!search||x["Applicant's Name"].toLowerCase().includes(search))&&
    (!from||new Date(x["Interview Date"])>=new Date(from))&&(!to||new Date(x["Interview Date"])<=new Date(to))
  );
  updateKPI(d);renderTable(d);
}

// ✅ CLEAR FILTERS BUTTON
document.getElementById('clearFilters').addEventListener('click',()=>{
  positionFilter.value='';
  companyFilter.value='';
  resultFilter.value='';
  dateFrom.value='';
  dateTo.value='';
  searchBox.value='';
  renderTable(window.allData);
  updateKPI(window.allData);
});

Papa.parse('data.csv',{download:true,header:true,complete:r=>{
  window.allData=r.data;
  updateKPI(r.data);
  populateFilters(r.data);
  renderTable(r.data);
}});
[positionFilter,companyFilter,resultFilter,searchBox,dateFrom,dateTo]
.forEach(e=>e.addEventListener('input',applyFilters));
</script>
