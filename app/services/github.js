import { Octokit } from '@octokit/rest';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const OWNER = 'DFE-DIGITAL';
const REPO = 'd365-gds-powerpages';
const WORKFLOW_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes max wait

// Load private key from environment or file
const privateKeyPath = process.env.GH_PRIVATE_KEY_PATH || path.join(process.cwd(), 'd365-powerpages-importer.2025-06-29.private-key.pem');
let privateKey = null;

try {
  privateKey = process.env.GH_PRIVATE_KEY || fs.readFileSync(privateKeyPath, 'utf8');
} catch (err) {
  console.warn('GitHub App private key not found - GitHub integration will be unavailable');
}

/**
 * Generate a unique correlation ID for tracking workflow runs
 */
export function generateCorrelationId() {
  return crypto.randomBytes(8).toString('hex');
}

/**
 * Check if GitHub integration is available
 */
export function isAvailable() {
  return privateKey !== null && process.env.GH_APP_ID && process.env.GH_APP_INSTALL_ID;
}

/**
 * Generate a JWT token for GitHub App authentication
 */
function generateJWT() {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iat: now - 60,
    exp: now + (10 * 60),
    iss: process.env.GH_APP_ID
  };
  return jwt.sign(payload, privateKey, { algorithm: 'RS256' });
}

/**
 * Get an installation access token from GitHub
 */
async function getInstallationToken(jwtToken) {
  const octokit = new Octokit({ auth: jwtToken });
  const { data } = await octokit.request(
    'POST /app/installations/{installation_id}/access_tokens',
    { installation_id: Number(process.env.GH_APP_INSTALL_ID) }
  );
  return data.token;
}

/**
 * Get an authenticated Octokit instance
 */
export async function getAuthenticatedClient() {
  if (!isAvailable()) {
    throw new Error('GitHub integration is not configured');
  }
  const jwtToken = generateJWT();
  const installToken = await getInstallationToken(jwtToken);
  return new Octokit({ auth: installToken });
}

/**
 * Trigger a repository dispatch event to start the import workflow
 */
export async function triggerImport({ brand, environmentUrl, clientId, clientSecret, correlationId }) {
  const eventTypeMap = {
    'dfe': 'create-dfe-website',
    'govuk': 'create-govuk-website'
  };

  const eventType = eventTypeMap[brand];
  if (!eventType) {
    throw new Error('Invalid brand. Must be "dfe" or "govuk"');
  }

  if (!correlationId) {
    correlationId = generateCorrelationId();
  }

  const github = await getAuthenticatedClient();
  const dispatchTime = new Date().toISOString();

  await github.request('POST /repos/{owner}/{repo}/dispatches', {
    owner: OWNER,
    repo: REPO,
    event_type: eventType,
    client_payload: {
      environment_url: environmentUrl,
      client_id: clientId,
      client_secret: clientSecret,
      correlation_id: correlationId
    }
  });

  return {
    correlationId,
    dispatchTime,
    timeoutMs: WORKFLOW_TIMEOUT_MS
  };
}

/**
 * Find a workflow run triggered after a specific time
 * This helps correlate a dispatch with its resulting run
 */
export async function findRunAfterTime(dispatchTime, eventType = null) {
  const github = await getAuthenticatedClient();
  const dispatchDate = new Date(dispatchTime);

  const params = {
    owner: OWNER,
    repo: REPO,
    per_page: 10,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  };

  // Filter by event type if provided (repository_dispatch)
  if (eventType) {
    params.event = eventType;
  }

  const { data } = await github.request('GET /repos/{owner}/{repo}/actions/runs', params);

  // Find runs that started after our dispatch time
  // Allow a small buffer (runs may start slightly before the dispatch returns)
  const bufferMs = 5000; // 5 second buffer
  const matchingRun = data.workflow_runs.find(run => {
    const runCreated = new Date(run.created_at);
    return runCreated >= new Date(dispatchDate.getTime() - bufferMs);
  });

  if (matchingRun) {
    return {
      id: matchingRun.id,
      status: matchingRun.status,
      conclusion: matchingRun.conclusion,
      createdAt: matchingRun.created_at,
      htmlUrl: matchingRun.html_url
    };
  }

  return null;
}

/**
 * Get the latest workflow run ID (legacy - prefer findRunAfterTime)
 */
export async function getLatestRunId() {
  const github = await getAuthenticatedClient();

  const { data } = await github.request('GET /repos/{owner}/{repo}/actions/runs', {
    owner: OWNER,
    repo: REPO,
    per_page: 1,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  });

  const latestRun = data.workflow_runs[0];
  return latestRun ? latestRun.id : null;
}

/**
 * Get the status of a specific workflow run
 */
export async function getRunStatus(runId) {
  if (!runId) {
    throw new Error('Run ID is required');
  }

  const github = await getAuthenticatedClient();

  const { data } = await github.request('GET /repos/{owner}/{repo}/actions/runs/{run_id}', {
    owner: OWNER,
    repo: REPO,
    run_id: runId,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  });

  return {
    status: data.status,
    conclusion: data.conclusion,
    htmlUrl: data.html_url
  };
}

/**
 * Get the timeout duration for workflow polling
 */
export function getTimeoutMs() {
  return WORKFLOW_TIMEOUT_MS;
}
