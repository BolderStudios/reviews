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
		// Initial request to get the total number of reviews
		const initialResponse = await postYelpReviewTask(alias, 10, env);
		const initialTaskId = initialResponse.data.tasks[0].id;
		console.log(`Initial Task ID: ${initialTaskId}`);

		const initialResults = await pollYelpResults(initialTaskId, env);
		const totalReviews = initialResults.totalReviews;
		console.log(`Total reviews: ${totalReviews}`);

		// If there are 10 or fewer reviews, return them immediately
		if (totalReviews <= 10) {
			console.log('10 or fewer reviews, returning initial results');
			return {
				success: true,
				reviews: initialResults.reviews,
				totalReviews: initialResults.totalReviews,
			};
		}

		// For more than 10 reviews, fetch in batches of 100
		let allReviews = [];
		const batchSize = 100;
		const batches = Math.ceil(totalReviews / batchSize);

		for (let i = 0; i < batches; i++) {
			const offset = i * batchSize;
			const depth = Math.min(batchSize, totalReviews - offset);

			console.log(`Fetching batch ${i + 1} of ${batches}, offset: ${offset}, depth: ${depth}`);

			const batchResponse = await postYelpReviewTask(alias, depth, env, offset);
			const batchTaskId = batchResponse.data.tasks[0].id;
			console.log(`Batch ${i + 1} Task ID: ${batchTaskId}`);

			const batchResults = await pollYelpResults(batchTaskId, env);
			allReviews = allReviews.concat(batchResults.reviews);

			console.log(`Fetched ${allReviews.length} reviews so far`);
		}

		console.log(`Fetched all ${allReviews.length} reviews`);
		return {
			success: true,
			reviews: allReviews,
			totalReviews: totalReviews,
		};
	} catch (error) {
		console.log(`Yelp fetching error —> `, error);
		return {
			success: false,
			message: error.message || 'Failed to fetch Yelp reviews',
		};
	}
}

async function postYelpReviewTask(alias, depth, env, offset = 0) {
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
				offset: offset,
			},
		],
		headers: { 'content-type': 'application/json' },
	});
}

async function pollYelpResults(taskId, env) {
	const maxAttempts = 100;
	let pollingInterval = 10000; // Start with 10 seconds
	const maxPollingInterval = 60000; // Max 1.5 minute between polls
	const backoffFactor = 1.25;

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
