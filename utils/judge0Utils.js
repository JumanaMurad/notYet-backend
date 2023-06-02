const apiKey = '3abb6dde21msh7cc8b3391194d87p1b2715jsn00d03f4b14b3';

exports.submitCodeToJudge0 = async (code, language, stdin, expectedOutput) => {
    const endpoint = 'https://judge0-ce.p.rapidapi.com/submissions';

    try {

        const requestBody = {
            source_code: code,
            language_id: language,
            stdin: stdin,
            expected_output: expectedOutput,
        };

        const config = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-RapidAPI-Key": apiKey,
                "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
            },
            body: JSON.stringify(requestBody),
        };

        const response = await fetch(
            endpoint,
            config
        );

        if (!response.ok) {
            throw new Error('Failed to submit code to Judge0');
        }

        // Extract the submission ID from the response
        const responseData = await response.json();
        const submissionId = responseData.token;

        return submissionId;
    } catch (error) {
        console.error('Failed to submit code to Judge0:', error);
        throw error;
    }
}


exports.getSubmissionStatusFromJudge0 = async (submissionId) => {
    const endpoint = `https://judge0-ce.p.rapidapi.com/submissions/${submissionId}`;

    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-RapidAPI-Key': apiKey,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to get submission status from Judge0');
        }

        // Extract the submission status from the response
        const responseData = await response.json();
        const status = responseData.status.description;

        // Print the result of the fetch request

        return status;
    } catch (error) {
        console.error('Failed to get submission status from Judge0:', error);
        throw error;
    }
}
