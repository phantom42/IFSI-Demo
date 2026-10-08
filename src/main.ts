import $ from 'jquery';
import dayjs from 'dayjs';
import DataTable, {type Api} from 'datatables.net-dt';
import './styles.css';
import type { ExamRequest, NewExamRequest, Student, Course, ValidationResult } from './types';
import { store } from './data';

let exam_request_data: ExamRequest[] = [];
let currentRequestsDataTable: Api<ExamRequest>;
//let filter:string = '';

// const searchRequests = (er: ExamRequest, f:string): boolean => {
// 	f = f.toLowerCase();
// 	if (er.first_name.toLowerCase().includes(f)) return true;
// 	if (er.last_name.toLowerCase().includes(f)) return true;
// 	if (er.fire_department!== null && er.fire_department.toLowerCase().includes(f)) return true;
// 	if (er.course_code.toLowerCase().includes(f)) return true ;
// 	if (er.course_name.toLowerCase().includes(f)) return true ;
// 	if (er.notes !== null && er.notes.toLowerCase().includes(f)) return true ;
// 	return false 
// }

export async function createExamRequest(formInput: NewExamRequest): Promise<boolean> {
	try {
		const student = exam_request_data.find((r) => r.student_id === formInput.student_id);
		const course = exam_request_data.find((r) => r.course_code === formInput.course_code);
		const request_id = getNewExamRequestId();
		if (!student || !course) throw new Error('invalid student or course');
		const newRequest: ExamRequest = {
			request_id: request_id,
			student_id: formInput.student_id,
			first_name: student.first_name,
			last_name: student.last_name,
			fire_department: student.fire_department,
			course_code: formInput.course_code,
			course_name: course.course_name,
			request_date: formInput.request_date,
			status: 'Pending',
			needs_accommodation: formInput.needs_accommodation ?? 0,
			notes: formInput.notes ?? null
		}
		const saved = await store.saveRequest(newRequest);
		exam_request_data.push(newRequest);
		currentRequestsDataTable.row.add(saved).draw(false);
		return true;
	} catch(error) {
		return false;
	}
}

function getNewExamRequestId():number {
	// this value is only relevant if not being written to a database. it won't be sent in those instances
	const maxId = Math.max(0,...exam_request_data.map(er => er.request_id));
	return maxId + 1;
}

function getStudents(requests:ExamRequest[]): Student[]{
	if (!requests) return []
	const mapData = new Map<number, Student>();
	for (const r of requests) {
		mapData.set(r.student_id, {
			student_id: r.student_id,
			first_name: r.first_name,
			last_name: r.last_name,
			fire_department: r.fire_department
		})
	}
	return [...mapData.values()].sort(
		(a,b) => a.last_name.localeCompare(b.last_name) || a.first_name.localeCompare(b.first_name)
	)
}

function getCourses(requests:ExamRequest[]): Course[]{
	if (!requests) return [];
	const mapData = new Map<string, Course>();
	for (const r of requests) {
		mapData.set(r.course_code, {
			course_code: r.course_code,
			course_name: r.course_name
		})
	}
	return [...mapData.values()].sort(
		(a,b) => a.course_name.localeCompare(b.course_name)
	)
}

function initTable():void{
	currentRequestsDataTable = new DataTable('#current_requests', {
		data: exam_request_data,
		columns: [
			{data: null, render: (_d, _t, r: ExamRequest) => `${r.last_name}, ${r.first_name}`},
			{data: null, render: (_d, _t, r: ExamRequest) => `${r.course_name} (${r.course_code})`},
			{data: 'request_date'},
			{data: 'status'},
			{data: 'needs_accommodation', render: (v: boolean) => (v ? 'Yes' : 'No')},
		],
		language: {
			search: 'Filter Requests:'
		},
		layout: {
			topStart: null,
			topEnd: 'search',
	
		}
	});
}
function resetValidation() {
	$('#resultMessage').removeClass('visible');
	$('.form-error').removeClass('visible');
	$('.form-input').css('border-color', '');
	$('.form-select').css('border-color', '');
	$('.form-date').css('border-color', '');
}
function validateRequest(): ValidationResult {
	resetValidation();
	const validateFields: string[] = ['#student_id','#course_code','#request_date'];
	let errors:string[] = [];
	let validForm:boolean = true;
	validateFields.forEach(field =>{
		let v = String($(field).val() ?? '');
		if ( v.length === 0) {
			validForm = false;
			errors.push(field);
			$(field).css('border-color', 'red');
			$(field).siblings('.form-error:not(.date-error)').addClass('visible');
		}
	})
	if (errors.includes('#request_date') == false) {
		const dateVal:string = String($('#request_date').val() ?? '');
		const today:Date = new Date();
		let validDate = true;
		if (validDate) validDate = dayjs(dateVal).isValid();
		if (validDate) validDate = dayjs(dateVal).isSame(today, 'day') || dayjs(dateVal).isAfter(today, 'day');
		if (!validDate){
			errors.push('#request_date');
			$('#request_date').siblings('.form-error.date-error').addClass('visible');
		}
	}

	if (validForm) {
		const isNAChecked = $('#needs_accommodation').prop('checked');
		if (isNAChecked) {
			const userConfirmed = confirm('Are you sure that you need special testing accommodations?');
			if (!userConfirmed) {
				$('#needs_accommodation').prop('checked', false);
				validForm = false;
				// don't add to the errors
			}
		}
	}
	
	return {
		'is_valid': validForm,
		'errors': errors
	};
}
function readForm(): NewExamRequest{
	return {
		student_id: Number($('#student_id').val()),
		course_code: String($('#course_code').val() ?? ''),
		request_date: String($('#request_date').val() ?? '').trim(),
		needs_accommodation: $('#needs_accommodation').is(':checked') ? 1 : 0,
		notes: String($('#notes').val() ?? '').trim() || null
	}
}
function bindForm():void {
	$('#requestForm').on('submit', async(e) => {
		e.preventDefault();
		const submission: NewExamRequest = readForm();
		const isValid:ValidationResult = validateRequest()
		if (!isValid.is_valid){
			if (isValid.errors?.length && isValid.errors.length > 0){
				$('#resultMessage').text((isValid.errors.length > 1 ? 'There were errors' : 'There was an error') + ' in your submission').css('color','red');

			}
			return ;
		} 
			
		const saved = await createExamRequest(submission);
		if (saved) {
			$('#resultMessage').text('The request was successfully submitted').css('color', 'green');
			$('#requestForm').trigger('reset');
		} else {
			$('#resultMessage').text('There was a problem submitting the request').css('color', 'red');
		}
	})
}
function populateStudentSelect(students:Student[]): void {
	students.forEach(student => {
		let display:string = `${student.last_name}, ${student.first_name}`;
		$('#student_id').append($('<option/>').val(student.student_id).html(display));
	})
}
function populateCourseSelect(courses:Course[]): void{
	courses.forEach(course => {
		let display: string = `${course.course_name} (${course.course_code})`;
		$('#course_code').append($('<option/>').val(course.course_code).html(display));
	})
}
$(async()=>{
	exam_request_data = await store.loadRequests();
	const students = getStudents(exam_request_data);
	populateStudentSelect(students);
	const courses = getCourses(exam_request_data);
	populateCourseSelect(courses);
	const today: string = new Date().toISOString().split('T')[0];

	$('#request_date').attr('min', today);
	initTable();
	bindForm();
})