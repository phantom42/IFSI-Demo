export interface ExamRequest {
	request_id: number,
	student_id: number,
	first_name: string,
	last_name: string,
	fire_department: string,
	course_code: string,
	course_name: string,
	request_date: string,
	status?: string,
	needs_accommodation?: number,
	notes?: string | null
}

export interface NewExamRequest {
	student_id: number,
	course_code: string,
	request_date: string,
	needs_accommodation?: number | null,
	notes?: string | null
}

export interface Student {
	student_id: number,
	first_name: string,
	last_name: string,
	//email: string,
	fire_department: string
}

export interface Course {
	course_code: string,
	course_name: string
}

export interface ValidationResult {
	is_valid: boolean,
	errors?: string[],
	msg?: string

}