async function buildAuditsTable(auditsTable, auditsTableHeader, token, message) {
  try {
    const response = await fetch("/api/v1/audits", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    var children = [auditsTableHeader];
    if (response.status === 200) {
      if (data.count === 0) {
        auditsTable.replaceChildren(...children);
        return 0;
      } else {
        for (let i = 0; i < data.audits.length; i++) {
          let editButton = `<td><button type="button" class="editButton" data-id=${data.audits[i]._id}>Edit</button></td>`;
          let deleteButton = `<td><button type="button" class="deleteButton" data-id=${data.audits[i]._id}>Delete</button></td>`;
          let rowHTML = `<td>${data.audits[i].auditName}</td><td>${data.audits[i].period}</td><td>${data.audits[i].year}</td><td>${data.audits[i].type}</td><td>${data.audits[i].highRiskAeras}</td><td>${data.audits[i].startDate}</td><td>${data.audits[i].status}</td><td>${data.audits[i].completionDate}</td><td>${data.audits[i].auditFindings}</td><td>${data.audits[i].timeSpent}</td>${editButton}${deleteButton}`;
          let rowEntry = document.createElement("tr");
          rowEntry.innerHTML = rowHTML;
          children.push(rowEntry);
        }
        auditsTable.replaceChildren(...children);
      }
      return data.count;
    } else {
      message.textContent = data.msg;
      return 0;
    }
  } catch (err) {
    message.textContent = "A communication error occurred.";
    return 0;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const logoff = document.getElementById("logoff");
  const message = document.getElementById("message");
  const logonRegister = document.getElementById("logon-register");
  const logon = document.getElementById("logon");
  const register = document.getElementById("register");
  const logonDiv = document.getElementById("logon-div");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const logonButton = document.getElementById("logon-button");
  const logonCancel = document.getElementById("logon-cancel");
  const registerDiv = document.getElementById("register-div");
  const name = document.getElementById("name");
  const email1 = document.getElementById("email1");
  const password1 = document.getElementById("password1");
  const password2 = document.getElementById("password2");
  const registerButton = document.getElementById("register-button");
  const registerCancel = document.getElementById("register-cancel");
  const audits = document.getElementById("audits");
  const auditsTable = document.getElementById("audits-table");
  const auditsTableHeader = document.getElementById("audits-table-header");
  const addAudit = document.getElementById("add-audit");
  const editAudit = document.getElementById("edit-audit");
  const auditName = document.getElementById("auditName");
  const period = document.getElementById("period");
  const year = document.getElementById("year");
  const type = document.getElementById("type");
  const highRiskAeras = document.getElementById("highRiskAeras");
  const startDate = document.getElementById("startDate");
  const status = document.getElementById("status");
  const completionDate = document.getElementById("completionDate");
  const auditFindings = document.getElementById("auditFindings");
  const timeSpent = document.getElementById("timeSpent");
  const addingAudit = document.getElementById("adding-audit");
  const auditsMessage = document.getElementById("audits-message");
  const editCancel = document.getElementById("edit-cancel");

  // section 2 
  let showing = logonRegister;
  let token = null;
  document.addEventListener("startDisplay", async () => {
    showing = logonRegister;
    token = localStorage.getItem("token");
    if (token) {
      //if the user is logged in
      logoff.style.display = "block";
      const count = await buildAuditsTable(
        auditsTable,
        auditsTableHeader,
        token,
        message
      );
      if (count > 0) {
        auditsMessage.textContent = "";
        auditsTable.style.display = "block";
      } else {
        auditsMessage.textContent = "There are no audits to display for this user.";
        auditsTable.style.display = "none";
      }
      audits.style.display = "block";
      showing = audits;
    } else {
      logonRegister.style.display = "block";
    }
  });

  var thisEvent = new Event("startDisplay");
  document.dispatchEvent(thisEvent);
  var suspendInput = false;

  // section 3
  document.addEventListener("click", async (e) => {
    if (suspendInput) {
      return; // we don't want to act on buttons while doing async operations
    }
    if (e.target.nodeName === "BUTTON") {
      message.textContent = "";
    }
    if (e.target === logoff) {
      localStorage.removeItem("token");
      token = null;
      showing.style.display = "none";
      logonRegister.style.display = "block";
      showing = logonRegister;
      auditsTable.replaceChildren(auditsTableHeader); // don't want other users to see
      message.textContent = "You are logged off.";
    } else if (e.target === logon) {
      showing.style.display = "none";
      logonDiv.style.display = "block";
      showing = logonDiv;
    } else if (e.target === register) {
      showing.style.display = "none";
      registerDiv.style.display = "block";
      showing = registerDiv;
    } else if (e.target === logonCancel || e.target == registerCancel) {
      showing.style.display = "none";
      logonRegister.style.display = "block";
      showing = logonRegister;
      email.value = "";
      password.value = "";
      name.value = "";
      email1.value = "";
      password1.value = "";
      password2.value = "";
    } else if (e.target === logonButton) {
      suspendInput = true;
      try {
        const response = await fetch("/api/v1/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.value,
            password: password.value,
          }),
        });
        const data = await response.json();
        if (response.status === 200) {
          message.textContent = `Logon successful.  Welcome ${data.user.name}`;
          token = data.token;
          localStorage.setItem("token", token);
          showing.style.display = "none";
          thisEvent = new Event("startDisplay");
          email.value = "";
          password.value = "";
          document.dispatchEvent(thisEvent);
        } else {
          message.textContent = data.msg;
        }
      } catch (err) {
        message.textContent = "A communication error occurred.";
      }
      suspendInput = false;
    } else if (e.target === registerButton) {
      if (password1.value != password2.value) {
        message.textContent = "The passwords entered do not match.";
      } else {
        suspendInput = true;
        try {
          const response = await fetch("/api/v1/auth/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: name.value,
              email: email1.value,
              password: password1.value,
            }),
          });
          const data = await response.json();
          if (response.status === 201) {
            message.textContent = `Registration successful.  Welcome ${data.user.name}`;
            token = data.token;
            localStorage.setItem("token", token);
            showing.style.display = "none";
            thisEvent = new Event("startDisplay");
            document.dispatchEvent(thisEvent);
            name.value = "";
            email1.value = "";
            password1.value = "";
            password2.value = "";
          } else {
            message.textContent = data.msg;
          }
        } catch (err) {
          message.textContent = "A communication error occurred.";
        }
        suspendInput = false;
      }
    } // section 4
    else if (e.target === addAudit) {
      showing.style.display = "none";
      editAudit.style.display = "block";
      showing = editAudit;
      delete editAudit.dataset.id;
      auditName.value = "";
      year.value = "";
      status.value = "Not started";
      startDate.value= Date.now();
      period.value= "";
      auditFindings.value= 0;
      highRiskAeras.value = "No";
      timeSpent.value = 0;
      completionDate.value= Date.now();
      addingAudit.textContent = "Add";
    } else if (e.target === editCancel) {
      showing.style.display = "none";
      auditName.value = "";
      year.value = "";
      status.value = "Not started";
      startDate.value= Date.now();
      period.value= "Q1";
      type.value ="Finance";
      highRiskAeras.value = "No";
      timeSpent.value = 0;
      completionDate.value= Date.now();
      thisEvent = new Event("startDisplay");
      document.dispatchEvent(thisEvent);
    } else if (e.target === addingAudit) {

      if (!editAudit.dataset.id) {
        // this is an attempted add
        suspendInput = true;
        try {
          const response = await fetch("/api/v1/audits", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              auditName: auditName.value,
              year: year.value,
              status: status.value,
              startDate: startDate.value,
              period: period.value,
              type: type.value,
              auditFindings: auditFindings.value,
              highRiskAeras: highRiskAeras.value,
              timeSpent: timeSpent.value,
              completionDate: completionDate.value,
            }),
          });
          const data = await response.json();
          if (response.status === 201) {
            //successful create
            message.textContent = "The audit entry was created.";
            showing.style.display = "none";
            thisEvent = new Event("startDisplay");
            document.dispatchEvent(thisEvent);
            auditName.value = "";
            year.value = "";
            status.value = "Not started";
            startDate.value = Date.now();
            period.value = "Q1";
            type.value ="Finance";
            auditFindings.value= 0;
            highRiskAeras.value = "No";
            timeSpent.value= 0;
            completionDate.value= Date.now();
          } else {
            // failure
            message.textContent = data.msg;
          }
        } catch (err) {
          message.textContent = "A communication error occurred.";
        }
        suspendInput = false;
      } else {
        // this is an update
        suspendInput = true;
        try {
          const auditID = editAudit.dataset.id;
          const response = await fetch(`/api/v1/audits/${auditID}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              auditName: auditName.value,
              year: year.value,
              status: status.value,
              startDate: startDate.value,
              period: period.value,
              type: type.value,
              auditFindings: auditFindings.value,
              highRiskAeras: highRiskAeras.value,
              timeSpent: timeSpent.value,
              completionDate: completionDate.value,
            }),
          });
          const data = await response.json();
          if (response.status === 200) {
            message.textContent = "The entry was updated.";
            showing.style.display = "none";
            auditName.value = "";
            year.value = "";
            status.value = "Not started";
            startDate.value = Date.now();
            period.value ="Q1";
            type.value ="Finance";
            auditFindings.value= 0;
            highRiskAeras.value = "No";
            timeSpent.value = 0;
            completionDate.value= Date.now();
            thisEvent = new Event("startDisplay");
            document.dispatchEvent(thisEvent);
          } else {
            message.textContent = data.msg;
          }
        } catch (err) {

          message.textContent = "A communication error occurred.";
        }
      }
      suspendInput = false;
    } // section 5
    else if (e.target.classList.contains("editButton")) {
      editAudit.dataset.id = e.target.dataset.id;
      suspendInput = true;
      try {
        const response = await fetch(`/api/v1/audits/${e.target.dataset.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.status === 200) {
          auditName.value = data.audit.auditName;
          year.value = data.audit.year;
          status.value = data.audit.status;
          startDate.value = data.audit.startDate;
          period.value = data.audit.period;
          type.value = data.audit.type;
          auditFindings.value = data.audit.auditFindings;
          highRiskAeras.value = data.audit.highRiskAeras;
          timeSpent.value = data.audit.timeSpent;
          completionDate.value = data.audit.completionDate;
          showing.style.display = "none";
          showing = editAudit;
          showing.style.display = "block";
          addingAudit.textContent = "Update";
          message.textContent = "";
        } else {
          // might happen if the list has been updated since last display
          message.textContent = "The audits entry was not found";
          thisEvent = new Event("startDisplay");
          document.dispatchEvent(thisEvent);
        }
      } catch (err) {
        message.textContent = "A communication error has occurred.";
      }
      suspendInput = false;
    } // section 6
    else if (e.target.classList.contains("deleteButton")) {
      editAudit.dataset.id = e.target.dataset.id;
      suspendInput = true;
      try {
        const response = await fetch(`/api/v1/audits/${e.target.dataset.id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            auditName: auditName.value,
            year: year.value,
            status: status.value,
            startDate: startDate.value,
            period: period.value,
            type: type.value,
            auditFindings: auditFindings.value,
            highRiskAeras: highRiskAeras.value,
            timeSpent: timeSpent.value,
            completionDate: completionDate.value,
          }),
        });
        const data = await response.json();
        if (response.status === 200) {
          message.textContent = "The entry was deleted.";
          showing.style.display = "none";
          auditName.value = "";
          year.value = "";
          status.value = "Not started";
          startDate.value = Date.now();
          period.value = "Q1";
          type.value ="Finance";
          auditFindings.value= 0;
          highRiskAeras.value ="No";
          timeSpent.value = 0;
          completionDate.value= Date.now();
          thisEvent = new Event("startDisplay");
          document.dispatchEvent(thisEvent);
        }  else {
          // might happen if the list has been updated since last display
          message.textContent = "The audits entry was not found";
          thisEvent = new Event("startDisplay");
          document.dispatchEvent(thisEvent);
        }
      } catch (err) {
        message.textContent = "A communication error has occurred.";
      }
      suspendInput = false;
    }
  })

});