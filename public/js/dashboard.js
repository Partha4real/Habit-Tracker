let form = document.getElementById('content_habit_form');
let new_habit_btn =  document.getElementById('new_habit');
let cancel_btn = document.getElementById('cancel_habit');
form.style.display = 'none';
new_habit_btn.onclick = function() {
    form.style.display = 'block';
};
cancel_btn.onclick = function() {
    form.style.display = 'none';
}
window.onclick = function(event) {
    if (event.target == form) {
      form.style.display = "none";
    }
}

// streak details

let division = document.getElementById('streak_details');
let streak_btn = document.getElementById('streak');
let cancel_streak_btn = document.getElementById('close_streak');

division.style.display = 'none';
streak_btn.onclick = function() {
    division.style.display = 'block';
};
cancel_streak_btn.onclick = function() {
    division.style.display = 'none';
}
window.onclick = function(event) {
    if (event.target == division) {
      division.style.display = "none";
    }
} 