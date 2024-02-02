$(document).ready(() => {
    $("#modal-button").click(() => {
        $(".modal-body").html("");
        $.get(`/api/events`, (results = {}) => {
            let data = results.data;
            if (!data || !data.events) return;
            data.events.forEach((event) => {
                $(".modal-body").append(
                    `<div>
                <span class="event-title">
                ${event.title}
                </span>
                <div class='event-description'>
                ${event.description}
                </div>
                <button class='${event.joined ? "joined-button" : "join-button"}' data-id="${event._id}">
${event.joined ? "Joined" : "Join"}
</button>
                </div>`
                );
            });
        }).then(() => {
            $(".join-button").click((event) => {    //not event model
                let $button = $(event.target),  //this event is not the event model
                    eventId = $button.data("id");
                $.get(
                    `/api/events/${eventId}/join`,
                    (results = {}) => {
                        let data = results.data;
                        if (data && data.success) {
                            $button
                                .text("Joined")
                                .addClass("joined-button")
                                .removeClass("join-button");
                        } else {
                            $button.text("Try again");
                        }
                    }
                );
            });
        });
    });
});

// $(document).ready(() => {
//     $("#modal-button").click(() => {
//         let apiToken = $("#apiToken").data("token");
//         if (!apiToken) {
//             $(".modal-body").html("<p>You need to log in to view the modal!!</p>");
//         } else {
//             $(".modal-body").html("");
//         }

//         // $(".modal-body").html("");
//         $.get(`/api/events?apiToken=${apiToken}`, (results = {}) => {
//             let data = results.data;
//             if (!data || !data.events) return;
//             data.events.forEach((event) => {
//                 $(".modal-body").append(
//                     `<div>
//                     <span class="event-title">
//                     ${event.title}
//                     </span>
//                     <div class='event-description'>
//                     ${event.description}
//                     </div>
//                     <button class='${event.joined ? "joined-button" : "join-button"}' data-id="${event._id}">
//                     ${event.joined ? "Joined" : "Join"}
//                     </button>
//             </div>`
//                 );
//             });
//         }).then(() => {
//             $(".join-button").click((event) => {
//                 let $button = $(event.target),
//                     eventId = $button.data("id");
//                 $.get(
//                     `/api/events/${eventId}/join`,
//                     (results = {}) => {
//                         let data = results.data;
//                         if (data && data.success) {
//                             $button
//                                 .text("Joined")
//                                 .addClass("joined-button")
//                                 .removeClass("join-button");
//                         } else {
//                             $button.text("Try again");
//                         }
//                     }
//                 );
//             });
//         });
//     });
// });





// $(document).ready(() => {
//     $("#modal-button").click(() => {
//         let apiToken = $("#apiToken").data("token");
//         if (!apiToken) {
//             $(".modal-body").html("<p>You need to log in to view modal!!</p>");
//           }
//           else {
//             $(".modal-body").html("");
//           }
//         // $(".modal-body").html("");
//         $.get(`/api/events?apiToken=${apiToken}`, (results = {}) => {
//             let data = results.data;
//             if (!data || !data.events) return;
//             data.events.forEach((event) => {
//                 $(".modal-body").append(
//                     `<div>
//                     <span class="event-title">
//                     ${event.title}
//                     </span>
//                     <div class='event-description'>
//                     ${event.description}
//                     </div>
//             <button class='${event.joined ? "joined-button" : "join-button"}' data-id="${event._id
//                     }">${event.joined ? "Joined" : "Join"}
//             </button>
//         </div>`
//                 );
//             });
//         }).then(() => {
//             $(".join-button").click((event) => {
//                 let $button = $(event.target),
//                     eventId = $button.data("id");
//                 $.get(
//                     `/api/events/${eventId}/attend?apiToken=${apiToken}`,
//                     (results = {}) => {
//                         let data = results.data
//                         if (data && data.success) {
//                             $button
//                                 .text("Joined")
//                                 .addClass("joined-button")
//                                 .removeClass("join-button");
//                         } else {
//                             $button.text("Try again");
//                         }
//                     }
//                 );
//             });
//         });
//     });
// });


// $(document).ready(() => {
//     $("#modal-button").click(() => {
//         let apiToken = $("#apiToken").data("token");

//         $(".modal-body").html("");
//         $.get(`/api/events?apiToken=${apiToken}`, (results = {}) => {
//             let data = results.data;
//             if (!data || !data.events) return;
//             data.events.forEach((event) => {
//                 $(".modal-body").append(
//                     `<div>
//                     <span class="event-title">
//                     ${event.title}
//                     </span>
//                     <div class='event-description'>
//                     ${event.description}
//                     </div>
//                     <button class='${event.joined ? "joined-button" : "join-button"}' data-id="${event._id
//                     }">${event.joined ? "Joined" : "Join"}</button>
//                         </div>`
//                 );
//             });
//         }).then(() => {
//             $(".join-button").click((event) => {
//                 let $button = $(event.target),
//                     eventId = $button.data("id");
//                 $.get(
//                     `/api/events/${eventId}/attend?apiToken=${apiToken}`,
//                     (results = {}) => {
//                         let data = results.data;
//                         if (data && data.success) {
//                             $button
//                                 .text("Joined")
//                                 .addClass("joined-button")
//                                 .removeClass("join-button");
//                         } else {
//                             $button.text("Try again");
//                         }
//                     }
//                 );
//             });
//         });
//     });
// });

const socket = io();

$("#chatForm").submit(() => {
    let text = $("#chat-input").val(),
        userName = $("#chat-user-name").val(),
        userId = $("#chat-user-id").val();
    socket.emit("message", {
        content: text,
        userName: userName,
        userId: userId
    });
    // $("#chat_input").val("");
    $("#chat-input").val("");
    return false;
});
socket.on("message", (message) => {
    displayMessage(message);
    for (let i = 0; i < 2; i++) {
        $(".chat-icon").fadeOut(200).fadeIn(200);
    }
});

socket.on("load all messages", (data) => {
    data.forEach((message) => {
        displayMessage(message);
    });
});

socket.on("user disconnected", () => {
    displayMessage({
        userName: "Notice",
        content: "user left the chat",
    });
});

let displayMessage = (message) => {
    $("#chat").prepend($("<li>").html(`
        <strong class="message ${getCurrentUserClass(
        message.user)}">
        ${message.name}
        </strong>: ${message.content}
        `)
    );
};

let getCurrentUserClass = (id) => {
    let userId = $("#chat-user-id").val();
    return userId === id ? "current-user" : "";
};
