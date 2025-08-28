import { test, expect } from '@playwright/test';
import { AuthAPI } from '../../pages/AuthAPI.js';
import { validCredentials } from '../../data/authData.js';

test.describe('Booking API Tests', () => {
  test('Test GET all bookings returns list of booking ids', async ({ request, baseURL }) => {
    const response = await request.get(`${baseURL}/booking`);

    expect(response.status()).toBe(200);
    const body = await response.json();

    expect(Array.isArray(body)).toBe(true);

    expect(body.length).toBeGreaterThan(0);

    for (const booking of body) {
      expect(booking).toHaveProperty('bookingid');
      expect(typeof booking.bookingid).toBe('number');
    }
  });

  test('Test GET booking by id returns correct booking details', async ({ request, baseURL }) => {
    const allBookingsResponse = await request.get(`${baseURL}/booking`);
    
    expect(allBookingsResponse.status()).toBe(200);

    const bookings = await allBookingsResponse.json();

    expect(Array.isArray(bookings)).toBe(true);
    expect(bookings.length).toBeGreaterThan(0);

    const bookingId = bookings[0].bookingid;
    const response = await request.get(`${baseURL}/booking/${bookingId}`);

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body).toHaveProperty('firstname');
    expect(body).toHaveProperty('lastname');
    expect(body).toHaveProperty('totalprice');
    expect(body).toHaveProperty('depositpaid');
    expect(body).toHaveProperty('bookingdates');
    expect(body.bookingdates).toHaveProperty('checkin');
    expect(body.bookingdates).toHaveProperty('checkout');
  });

  test('Test GET booking with invalid ID should return 404', async ({ request, baseURL }) => {
    const invalidBookingId = 88251515;
    const response = await request.get(`${baseURL}/booking/${invalidBookingId}`);

    expect(response.status()).toBe(404);

    const responseBody = await response.text();

    expect(responseBody).toBe('Not Found');
  });

  test('Test POST a new booking successfully', async ({ request, baseURL }) => {
    const payload = {
      firstname: 'Tobby',
      lastname: 'Brown',
      totalprice: 111,
      depositpaid: true,
      bookingdates: {
        checkin: '2018-01-01',
        checkout: '2019-01-01'
      },
      additionalneeds: 'Breakfast'
    };

    const response = await request.post(`${baseURL}/booking`,{
        data: payload
    });

    expect(response.status()).toBe(200);

    const responseBody = await response.json();

    expect(responseBody).toHaveProperty('bookingid');
    expect(responseBody).toHaveProperty('booking');

    const booking = responseBody.booking;

    expect(booking.firstname).toBe(payload.firstname);
    expect(booking.lastname).toBe(payload.lastname);
    expect(booking.totalprice).toBe(payload.totalprice);
    expect(booking.depositpaid).toBe(payload.depositpaid);
    expect(booking.bookingdates.checkin).toBe(payload.bookingdates.checkin);
    expect(booking.bookingdates.checkout).toBe(payload.bookingdates.checkout);
    expect(booking.additionalneeds).toBe(payload.additionalneeds);
  });

  test('Test PUT a newly created booking successfully', async ({ request, baseURL }) => {
    const authAPI = new AuthAPI(request, baseURL);
    const authResponse = await authAPI.authenticate(validCredentials.username, validCredentials.password);

    expect(authResponse.status()).toBe(200);
    
    const authBody = await authResponse.json();
    const token = authBody.token;

    expect(token).toBeDefined();

    const initialPayload = {
      firstname: 'Tobby',
      lastname: 'Brown',
      totalprice: 111,
      depositpaid: true,
      bookingdates: {
        checkin: '2018-01-01',
        checkout: '2019-01-01'
      },
      additionalneeds: 'Breakfast'
    };

    const createResponse = await request.post(`${baseURL}/booking`, {
      data: initialPayload
    });

    expect(createResponse.status()).toBe(200);

    const createBody = await createResponse.json();
    const bookingId = createBody.bookingid;

    expect(bookingId).toBeDefined();

    const updatedPayload = {
      firstname: 'James',
      lastname: 'Brown',
      totalprice: 222,
      depositpaid: false,
      bookingdates: {
        checkin: '2020-01-01',
        checkout: '2021-01-01'
      },
      additionalneeds: 'Lunch'
    };

    const updateResponse = await request.put(`${baseURL}/booking/${bookingId}`, {
        headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cookie': `token=${token}`
        },
        data: updatedPayload
    });

    expect(updateResponse.status()).toBe(200);

    const updateBody = await updateResponse.json();

    expect(updateBody.firstname).toBe(updatedPayload.firstname);
    expect(updateBody.lastname).toBe(updatedPayload.lastname);
    expect(updateBody.totalprice).toBe(updatedPayload.totalprice);
    expect(updateBody.depositpaid).toBe(updatedPayload.depositpaid);
    expect(updateBody.bookingdates.checkin).toBe(updatedPayload.bookingdates.checkin);
    expect(updateBody.bookingdates.checkout).toBe(updatedPayload.bookingdates.checkout);
    expect(updateBody.additionalneeds).toBe(updatedPayload.additionalneeds);
  });

  test('Test PATCH update firstname and lastname of a booking', async ({ request, baseURL }) => {
  const authAPI = new AuthAPI(request, baseURL);
  const authResponse = await authAPI.authenticate(validCredentials.username, validCredentials.password);

  expect(authResponse.status()).toBe(200);
  
  const authBody = await authResponse.json();
  const token = authBody.token;

  expect(token).toBeDefined();

  const initialPayload = {
    firstname: 'Tobby',
    lastname: 'Brown',
    totalprice: 111,
    depositpaid: true,
    bookingdates: {
      checkin: '2018-01-01',
      checkout: '2019-01-01'
    },
    additionalneeds: 'Breakfast'
  };

  const createResponse = await request.post(`${baseURL}/booking`, {
    data: initialPayload
  });

  expect(createResponse.status()).toBe(200);

  const createBody = await createResponse.json();
  const bookingId = createBody.bookingid;

  expect(bookingId).toBeDefined();

  const partialPayload = {
    firstname: 'Chris',
    lastname: 'Smith'
  };

  const patchResponse = await request.patch(`${baseURL}/booking/${bookingId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Cookie': `token=${token}`
    },
    data: partialPayload
  });

  expect(patchResponse.status()).toBe(200);

  const patchBody = await patchResponse.json();

  expect(patchBody.firstname).toBe(partialPayload.firstname);
  expect(patchBody.lastname).toBe(partialPayload.lastname);

  expect(patchBody.totalprice).toBe(initialPayload.totalprice);
  expect(patchBody.depositpaid).toBe(initialPayload.depositpaid);
  expect(patchBody.bookingdates.checkin).toBe(initialPayload.bookingdates.checkin);
  expect(patchBody.bookingdates.checkout).toBe(initialPayload.bookingdates.checkout);
  expect(patchBody.additionalneeds).toBe(initialPayload.additionalneeds);
 });

 test('Test DELETE a booking successfully', async ({ request, baseURL }) => {
  const authAPI = new AuthAPI(request, baseURL);
  const authResponse = await authAPI.authenticate(validCredentials.username, validCredentials.password);

  expect(authResponse.status()).toBe(200);

  const authBody = await authResponse.json();
  const token = authBody.token;

  expect(token).toBeDefined();

  const bookingPayload = {
    firstname: 'Tobby',
    lastname: 'Brown',
    totalprice: 111,
    depositpaid: true,
    bookingdates: {
      checkin: '2018-01-01',
      checkout: '2019-01-01'
    },
    additionalneeds: 'Breakfast'
  };

  const createResponse = await request.post(`${baseURL}/booking`, {
    data: bookingPayload
  });

  expect(createResponse.status()).toBe(200);

  const createBody = await createResponse.json();
  const bookingId = createBody.bookingid;

  expect(bookingId).toBeDefined();

  const deleteResponse = await request.delete(`${baseURL}/booking/${bookingId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `token=${token}`
    }
  });

  expect(deleteResponse.status()).toBe(201);

  const getResponse = await request.get(`${baseURL}/booking/${bookingId}`);

  expect(getResponse.status()).toBe(404);
 });

 test('Test PING health check API server successfully', async ({ request, baseURL }) => {
  const response = await request.get(`${baseURL}/ping`);

  expect(response.status()).toBe(201);
 });

});
