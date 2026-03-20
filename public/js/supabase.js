// ── SUPABASE CLIENT ──
var SUPABASE_URL = 'https://mymzcbalyqqgdmzsfmam.supabase.co';
var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15bXpjYmFseXFxZ2RtenNmbWFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5NTc4NTQsImV4cCI6MjA4OTUzMzg1NH0.gDyGhWZOktRtYgooQQ6Oka_7AmbbZQHCD9eyW8jcp-o';

var sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ── AUTH HELPERS ──
async function sbSignUp(email, password, username) {
  return sb.auth.signUp({
    email: email,
    password: password,
    options: { data: { username: username, full_name: username } }
  });
}

async function sbLogin(email, password) {
  return sb.auth.signInWithPassword({ email: email, password: password });
}

async function sbLogout() {
  return sb.auth.signOut();
}

async function sbResetPassword(email) {
  return sb.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin + '/#/login'
  });
}

async function sbGetSession() {
  var r = await sb.auth.getSession();
  return r.data.session;
}

async function sbGetProfile(userId) {
  var r = await sb.from('profiles').select('*').eq('id', userId).single();
  return r.data;
}

async function sbUpdateProfile(userId, updates) {
  return sb.from('profiles').update(updates).eq('id', userId);
}

async function sbSaveResult(resultData) {
  return sb.from('results').insert(resultData);
}

async function sbGetResults(userId) {
  return sb.from('results').select('*').eq('user_id', userId).order('created_at', { ascending: false });
}

async function sbGetAllResults() {
  return sb.from('results').select('*, profiles(username, full_name)').order('created_at', { ascending: false });
}

async function sbDeleteResult(id) {
  return sb.from('results').delete().eq('id', id);
}

async function sbGetAllProfiles() {
  return sb.from('profiles').select('*').order('created_at', { ascending: false });
}

async function sbUpdateRole(userId, role) {
  return sb.from('profiles').update({ role: role }).eq('id', userId);
}
