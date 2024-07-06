import axios from 'axios';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pextrfkqkyzhumavhpqd.supabase.co';
const supabaseAnonKey =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBleHRyZmtxa3l6aHVtYXZocHFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTk2MjkzMjAsImV4cCI6MjAzNTIwNTMyMH0.mtIoATJNYZ3RVjdoPInOd6jEK2qTb7AFSEwqBa9VJjw';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const HARDCODED_USER_ID = 'e3d9a6e3-7b14-466c-b1a9-7a2881932e12';

export default {
	async fetch(request, env, ctx) {
		const corsHeaders = {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type',
		};

		if (request.method === 'OPTIONS') {
			return new Response(null, {
				headers: {
					...corsHeaders,
					Allow: 'GET, HEAD, POST, OPTIONS',
				},
			});
		}

		if (request.method === 'POST') {
			try {
				await updateIsFetching('true');
				const formData = await request.json();
				const result = await fetchYelpReviews(formData, env, ctx);
				await updateIsFetching('false');

				return new Response(JSON.stringify(result), {
					headers: {
						'Content-Type': 'application/json',
						...corsHeaders,
					},
				});
			} catch (error) {
				return new Response(JSON.stringify({ error: 'Invalid request', details: error.message }), {
					status: 400,
					headers: {
						'Content-Type': 'application/json',
						...corsHeaders,
					},
				});
			}
		} else {
			return new Response('Send a POST request to fetch Yelp reviews.', {
				status: 200,
				headers: {
					...corsHeaders,
				},
			});
		}
	},
};

async function updateIsFetching(isFetching) {
	try {
		const { data, error } = await supabase.from('users').update({ is_fetching: isFetching }).eq('id', HARDCODED_USER_ID);

		if (error) {
			console.error('Error updating is_fetching:', error);
			throw error;
		}

		console.log(`Updated is_fetching to ${isFetching}`);
	} catch (error) {
		console.error('Failed to update is_fetching:', error);
	}
}

async function fetchYelpReviews(formData, env, ctx) {
	console.log('Fetching reviews —> ', formData);
	const alias = formData.yelpBusinessLink.split('/').pop();

	try {
		const initialResponse = await postYelpReviewTask(alias, 10, env);
		const taskId = initialResponse.data.tasks[0].id;
		console.log(`Task ID: ${taskId}`);

		const initialResults = await pollYelpResults(taskId, env);
		const totalReviews = initialResults.totalReviews;
		console.log(`Total reviews: ${totalReviews}`);

		if (totalReviews > 10) {
			const fullResponse = await postYelpReviewTask(alias, totalReviews, env);
			const fullTaskId = fullResponse.data.tasks[0].id;
			const allReviews = await pollYelpResults(fullTaskId, env);

			console.log('More than 10 reviews');
			return {
				success: true,
				reviews: allReviews.reviews,
				totalReviews: allReviews.totalReviews,
			};
		} else {
			console.log('Less or equal to 10 reviews');
			return {
				success: true,
				reviews: initialResults.reviews,
				totalReviews: initialResults.totalReviews,
			};
		}
	} catch (error) {
		console.log(`Yelp fetching error —> `, error);
		return {
			success: false,
			message: error.message || 'Failed to fetch Yelp reviews',
		};
	}
}

async function postYelpReviewTask(alias, depth, env) {
	return axios({
		method: 'post',
		url: 'https://api.dataforseo.com/v3/business_data/yelp/reviews/task_post',
		auth: {
			username: '0986881@lbcc.edu',
			password: '4045d2967d70b68e',
		},
		data: [
			{
				language_name: 'English',
				alias: alias,
				depth: depth,
			},
		],
		headers: { 'content-type': 'application/json' },
	});
}

async function pollYelpResults(taskId, env) {
	const maxAttempts = 100;
	let pollingInterval = 10000; // Start with 10 seconds
	const maxPollingInterval = 90000; // Max 1.5 minute between polls
	const backoffFactor = 1.5;

	for (let attempt = 0; attempt < maxAttempts; attempt++) {
		try {
			const response = await axios({
				method: 'get',
				url: `https://api.dataforseo.com/v3/business_data/yelp/reviews/task_get/${taskId}`,
				auth: {
					username: '0986881@lbcc.edu',
					password: '4045d2967d70b68e',
				},
				headers: { 'content-type': 'application/json' },
			});

			console.log(`Polling attempt ${attempt + 1}, status code: ${response.data.tasks[0].status_code}`);

			if (response.data.tasks[0].status_code === 20000) {
				const result = response.data.tasks[0].result[0];
				return {
					success: true,
					reviews: result.items,
					totalReviews: result.reviews_count,
				};
			} else if (response.data.tasks[0].status_code === 40601 || response.data.tasks[0].status_code === 40602) {
				console.log('Task is still in progress, continuing to poll...');
			} else {
				throw new Error(`Unexpected status code: ${response.data.tasks[0].status_code}`);
			}
		} catch (error) {
			console.error('Error polling Yelp results:', error);
			if (error.message.includes('Unexpected status code')) {
				throw error;
			}
		}

		// Implement exponential backoff
		await new Promise((resolve) => setTimeout(resolve, pollingInterval));
		pollingInterval = Math.min(pollingInterval * backoffFactor, maxPollingInterval);
	}

	// If we've reached this point, we've exceeded the maximum number of attempts
	throw new Error('Maximum polling attempts reached without completion');
}
