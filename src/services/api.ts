// // Central API client for Cloud Adoption Conference App
// // All new screen integrations go through this file.

// const BASE_URL =
//   process.env.EXPO_PUBLIC_API_URL || "https://api.lifesciencesdreamin.com/api";

// type ApiOptions = {
//   method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
//   token?: string;
//   body?: Record<string, unknown>;
// };

// export type ApiResponse<T = any> = {
//   success?: boolean;
//   message?: string;
//   data?: T;
//   meta?: {
//     current_page?: number;
//     last_page?: number;
//     per_page?: number;
//     total?: number;
//   };
//   errors?: Record<string, string[]>;
// };

// export async function apiRequest<T = any>(
//   path: string,
//   options: ApiOptions = {},
// ): Promise<ApiResponse<T>> {
//   const { method = "GET", token, body } = options;

//   const headers: Record<string, string> = {
//     "Content-Type": "application/json",
//     Accept: "application/json",
//   };
//   if (token) headers.Authorization = `Bearer ${token}`;

//   const response = await fetch(`${BASE_URL}${path}`, {
//     method,
//     headers,
//     body: body ? JSON.stringify(body) : undefined,
//   });

//   const text = await response.text();
//   let data: ApiResponse<T> = {};
//   try {
//     data = text ? JSON.parse(text) : {};
//   } catch {
//     // non-JSON response
//   }

//   if (!response.ok || data.success === false) {
//     const firstValidationError =
//       data.errors && Object.values(data.errors)[0]?.[0];
//     throw new Error(
//       data.message ||
//         firstValidationError ||
//         `Request failed (${response.status})`,
//     );
//   }

//   return data;
// }

// /* ---------- Typed helpers per endpoint ---------- */

// export type ConferenceInfo = {
//   id: number;
//   title: string;
//   slug?: string;
//   conference_date?: string;
//   venue_name?: string;
//   venue_address?: string;
//   venue_city?: string;
//   venue_state?: string;
//   google_map_url?: string;
//   status?: string;
// };

// export type AgendaItem = {
//   id: number;
//   conference_id: number;
//   session_name: string;
//   presenter: string;
//   session_date: string;
//   duration: string | number;
//   place: string;
//   room: string;
// };

// export type Attendee = {
//   registration_id: number;
//   approval_status: string;
//   ticket_reference?: string;
//   user: {
//     id?: number;
//     name?: string;
//     email?: string;
//     phone?: string;
//     company_name?: string;
//     designation?: string;
//     city?: string;
//     state?: string;
//   };
//   conference?: { id?: number; title?: string };
// };

// export type BookmarkItem = {
//   id: number;
//   attendee: {
//     id: number; // registration id (use for DELETE /bookmarks/{id})
//     name?: string;
//     email?: string;
//     company_name?: string;
//     designation?: string;
//     linkedin_url?: string;
//   };
//   conference?: { id?: number; title?: string };
// };

// export type Infographics = {
//   conference_id: number;
//   total_attendees: number;
//   geographic_distribution: { city: string; total: number }[];
//   area_of_interest_breakdown: {
//     area_of_interest: string | null;
//     total: number;
//   }[];
// };

// export const api = {
//   login: (email: string, password: string) =>
//     apiRequest<{ token: string; user: any }>("/login", {
//       method: "POST",
//       body: { email, password },
//     }),

//   me: (token: string) => apiRequest<any>("/me", { token }),

//   logout: (token: string) => apiRequest("/logout", { method: "POST", token }),

//   conference: (id: number, token?: string) =>
//     apiRequest<ConferenceInfo>(`/conferences/${id}`, { token }),

//   myAgenda: (token: string) =>
//     apiRequest<AgendaItem[]>("/my-conference/agenda", { token }),

//   myAttendees: (token: string, search = "", perPage = 100) =>
//     apiRequest<Attendee[]>(
//       `/my-conference/attendees?per_page=${perPage}${
//         search ? `&search=${encodeURIComponent(search)}` : ""
//       }`,
//       { token },
//     ),

//   infographics: (token: string) =>
//     apiRequest<Infographics>("/infographics", { token }),

//   bookmarks: (token: string) =>
//     apiRequest<BookmarkItem[]>("/bookmarks", { token }),

//   addBookmark: (token: string, registrationId: number) =>
//     apiRequest(`/bookmarks/${registrationId}`, { method: "POST", token }),

//   removeBookmark: (token: string, registrationId: number) =>
//     apiRequest(`/bookmarks/${registrationId}`, { method: "DELETE", token }),
// };

// /* ---------- Admin: Conference Management ---------- */

// export type ConferencePayload = {
//   title: string;
//   conference_date: string; // YYYY-MM-DD
//   venue_name: string;
//   venue_address: string;
//   venue_city: string;
//   venue_state: string;
//   active_start_date: string; // YYYY-MM-DD
//   active_end_date: string; // YYYY-MM-DD
//   google_map_url: string;
//   status: "active" | "inactive";
// };

// export type Ticket = {
//   id: number;
//   conference_id: number;
//   ticket_reference: string;
//   ticket_holder_name?: string;
//   ticket_holder_email?: string;
//   ticket_source?: string;
//   status: string;
// };

// export const adminApi = {
//   conferences: (token: string, search = "") =>
//     apiRequest<ConferenceInfo[]>(
//       `/admin/conferences?per_page=100${search ? `&search=${encodeURIComponent(search)}` : ""}`,
//       { token },
//     ),

//   createConference: (token: string, payload: ConferencePayload) =>
//     apiRequest<ConferenceInfo>("/admin/conferences", {
//       method: "POST",
//       token,
//       body: payload,
//     }),

//   updateConference: (token: string, id: number, payload: ConferencePayload) =>
//     apiRequest<ConferenceInfo>(`/admin/conferences/${id}`, {
//       method: "PUT",
//       token,
//       body: payload,
//     }),

//   deleteConference: (token: string, id: number) =>
//     apiRequest(`/admin/conferences/${id}`, { method: "DELETE", token }),

//   updateConferenceStatus: (
//     token: string,
//     id: number,
//     status: "active" | "inactive",
//   ) =>
//     apiRequest(`/admin/conferences/${id}/status`, {
//       method: "PATCH",
//       token,
//       body: { status },
//     }),

//   tickets: (token: string, conferenceId?: number) =>
//     apiRequest<Ticket[]>(
//       `/admin/tickets${conferenceId ? `?conference_id=${conferenceId}` : ""}`,
//       { token },
//     ),

//   // Multipart upload — do NOT set Content-Type manually; fetch adds the boundary.
//   importTickets: async (
//     token: string,
//     conferenceId: number,
//     file: { uri: string; name: string; mimeType?: string },
//   ): Promise<ApiResponse> => {
//     const form = new FormData();
//     form.append("conference_id", String(conferenceId));
//     form.append("file", {
//       uri: file.uri,
//       name: file.name,
//       type:
//         file.mimeType ||
//         "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//     } as any);

//     const response = await fetch(`${BASE_URL}/admin/tickets/import`, {
//       method: "POST",
//       headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
//       body: form,
//     });

//     const text = await response.text();
//     let data: ApiResponse = {};
//     try {
//       data = text ? JSON.parse(text) : {};
//     } catch {
//       // non-JSON
//     }

//     if (!response.ok || data.success === false) {
//       const firstValidationError =
//         data.errors && Object.values(data.errors)[0]?.[0];
//       throw new Error(
//         data.message ||
//           firstValidationError ||
//           `Upload failed (${response.status})`,
//       );
//     }
//     return data;
//   },
// };

// /* ---------- Admin: Agenda Management (per conference) ---------- */

// export type AgendaPayload = {
//   session_name: string;
//   presenter: string;
//   session_date: string; // YYYY-MM-DD (must be today or later when creating)
//   duration: string; // free text, e.g. "60 min"
//   place: string;
//   room: string;
// };

// export const agendaApi = {
//   list: (token: string, conferenceId: number) =>
//     apiRequest<AgendaItem[]>(`/admin/conferences/${conferenceId}/agendas`, {
//       token,
//     }),

//   create: (token: string, conferenceId: number, payload: AgendaPayload) =>
//     apiRequest<AgendaItem>(`/admin/conferences/${conferenceId}/agendas`, {
//       method: "POST",
//       token,
//       body: payload,
//     }),

//   update: (
//     token: string,
//     conferenceId: number,
//     agendaId: number,
//     payload: AgendaPayload,
//   ) =>
//     apiRequest<AgendaItem>(
//       `/admin/conferences/${conferenceId}/agendas/${agendaId}`,
//       {
//         method: "PUT",
//         token,
//         body: payload,
//       },
//     ),

//   remove: (token: string, conferenceId: number, agendaId: number) =>
//     apiRequest(`/admin/conferences/${conferenceId}/agendas/${agendaId}`, {
//       method: "DELETE",
//       token,
//     }),
// };

// Central API client for Cloud Adoption Conference App
// All new screen integrations go through this file.

// Central API client for Cloud Adoption Conference App
// All new screen integrations go through this file.

const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "https://api.lifesciencesdreamin.com/api";

type ApiOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  token?: string;
  body?: Record<string, unknown>;
};

export type ApiResponse<T = any> = {
  success?: boolean;
  message?: string;
  data?: T;
  meta?: {
    current_page?: number;
    last_page?: number;
    per_page?: number;
    total?: number;
  };
  errors?: Record<string, string[]>;
};

export async function apiRequest<T = any>(
  path: string,
  options: ApiOptions = {},
): Promise<ApiResponse<T>> {
  const { method = "GET", token, body } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const requestUrl = path.startsWith('http') ? path : `${BASE_URL}${path}`;
  const response = await fetch(requestUrl, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  let data: ApiResponse<T> = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    // non-JSON response
  }

  if (!response.ok || data.success === false) {
    const firstValidationError =
      data.errors && Object.values(data.errors)[0]?.[0];
    throw new Error(
      data.message ||
        firstValidationError ||
        `Request failed (${response.status})`,
    );
  }

  return data;
}

/* ---------- Typed helpers per endpoint ---------- */

export type ConferenceInfo = {
  id: number;
  title: string;
  slug?: string;
  conference_date?: string;
  active_start_date?: string;
  active_end_date?: string;
  venue_name?: string;
  venue_address?: string;
  venue_city?: string;
  venue_state?: string;
  google_map_url?: string;
  status?: string;
};

export type AgendaItem = {
  id: number;
  conference_id: number;
  session_name: string;
  presenter: string;
  session_date: string;
  duration: string | number;
  place: string;
  room: string;
};

export type Attendee = {
  registration_id: number;
  approval_status: string;
  ticket_reference?: string;
  user: {
    id?: number;
    name?: string;
    email?: string;
    phone?: string;
    company_name?: string;
    designation?: string;
    city?: string;
    state?: string;
  };
  conference?: { id?: number; title?: string };
};

export type BookmarkItem = {
  id: number;
  attendee: {
    id: number; // registration id (use for DELETE /bookmarks/{id})
    name?: string;
    email?: string;
    company_name?: string;
    designation?: string;
    linkedin_url?: string;
  };
  conference?: { id?: number; title?: string };
};

export type Infographics = {
  conference_id: number;
  total_attendees: number;
  geographic_distribution: { city: string; total: number }[];
  area_of_interest_breakdown: {
    area_of_interest: string | null;
    total: number;
  }[];
};

export const api = {
  login: (email: string, password: string) =>
    apiRequest<{ token: string; user: any }>("/login", {
      method: "POST",
      body: { email, password },
    }),

  me: (token: string) => apiRequest<any>("/me", { token }),

  updateProfile: (
    token: string,
    payload: {
      name: string;
      phone: string;
      email?: string;
      company_name: string;
      designation: string;
      city: string;
      state: string;
      area_of_interest: string;
      linkedin_url: string;
    },
  ) =>
    apiRequest<any>(process.env.EXPO_PUBLIC_USER_PROFILE_URL || "/profile", {
      method: "PUT",
      token,
      body: payload,
    }),

  logout: (token: string) => apiRequest("/logout", { method: "POST", token }),

  changePassword: (
    token: string,
    payload: {
      current_password: string;
      password: string;
      password_confirmation: string;
    },
  ) =>
    apiRequest(process.env.EXPO_PUBLIC_CHANGE_PASSWORD_URL || "/change-password", {
      method: "PUT",
      token,
      body: payload,
    }),

  conference: (id: number, token?: string) =>
    apiRequest<ConferenceInfo>(`/conferences/${id}`, { token }),

  myAgenda: (token: string) =>
    apiRequest<AgendaItem[]>("/my-conference/agenda", { token }),

  myAttendees: (token: string, search = "", perPage = 100) =>
    apiRequest<Attendee[]>(
      `/my-conference/attendees?per_page=${perPage}${
        search ? `&search=${encodeURIComponent(search)}` : ""
      }`,
      { token },
    ),

  infographics: (token: string) =>
    apiRequest<Infographics>("/infographics", { token }),

  bookmarks: (token: string) =>
    apiRequest<BookmarkItem[]>("/bookmarks", { token }),

  addBookmark: (token: string, registrationId: number) =>
    apiRequest(`/bookmarks/${registrationId}`, { method: "POST", token }),

  removeBookmark: (token: string, registrationId: number) =>
    apiRequest(`/bookmarks/${registrationId}`, { method: "DELETE", token }),
};

/* ---------- Admin: Conference Management ---------- */

export type ConferencePayload = {
  title: string;
  conference_date: string; // YYYY-MM-DD
  venue_name: string;
  venue_address: string;
  venue_city: string;
  venue_state: string;
  active_start_date: string; // YYYY-MM-DD
  active_end_date: string; // YYYY-MM-DD
  google_map_url: string;
  status: "active" | "inactive";
};

export type Ticket = {
  id: number;
  conference_id: number;
  ticket_reference: string;
  ticket_holder_name?: string;
  ticket_holder_email?: string;
  ticket_source?: string;
  status: string;
};

export const adminApi = {
  conferenceAttendees: (token: string) => {
    const endpoint = process.env.EXPO_PUBLIC_ADMIN_CONFERENCE_ATTENDEES_URL;
    if (!endpoint) {
      return Promise.reject(new Error('Conference attendees endpoint is not configured.'));
    }
    return apiRequest<unknown[]>(endpoint, { token });
  },

  conferences: (token: string, search = "") =>
    apiRequest<ConferenceInfo[]>(
      `/admin/conferences?per_page=100${search ? `&search=${encodeURIComponent(search)}` : ""}`,
      { token },
    ),

  createConference: (token: string, payload: ConferencePayload) =>
    apiRequest<ConferenceInfo>("/admin/conferences", {
      method: "POST",
      token,
      body: payload,
    }),

  updateConference: (token: string, id: number, payload: ConferencePayload) =>
    apiRequest<ConferenceInfo>(`/admin/conferences/${id}`, {
      method: "PUT",
      token,
      body: payload,
    }),

  deleteConference: (token: string, id: number) =>
    apiRequest(`/admin/conferences/${id}`, { method: "DELETE", token }),

  updateConferenceStatus: (
    token: string,
    id: number,
    status: "active" | "inactive",
  ) =>
    apiRequest(`/admin/conferences/${id}/status`, {
      method: "PATCH",
      token,
      body: { status },
    }),

  tickets: (token: string, conferenceId?: number) =>
    apiRequest<Ticket[]>(
      `/admin/tickets${conferenceId ? `?conference_id=${conferenceId}` : ""}`,
      { token },
    ),

  // Multipart upload — do NOT set Content-Type manually; fetch adds the boundary.
  importTickets: async (
    token: string,
    conferenceId: number,
    file: {
      uri: string;
      name: string;
      mimeType?: string;
      webFile?: Blob | null;
    },
  ): Promise<ApiResponse> => {
    const form = new FormData();
    form.append("conference_id", String(conferenceId));
    if (file.webFile) {
      // Web: DocumentPicker gives a real File/Blob — FormData needs that, not a {uri} object.
      form.append("file", file.webFile, file.name);
    } else {
      // Native (iOS/Android): React Native FormData accepts the {uri, name, type} shape.
      form.append("file", {
        uri: file.uri,
        name: file.name,
        type:
          file.mimeType ||
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      } as any);
    }

    const response = await fetch(`${BASE_URL}/admin/tickets/import`, {
      method: "POST",
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
      body: form,
    });

    const text = await response.text();
    let data: ApiResponse = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      // non-JSON
    }

    if (!response.ok || data.success === false) {
      const firstValidationError =
        data.errors && Object.values(data.errors)[0]?.[0];
      throw new Error(
        data.message ||
          firstValidationError ||
          `Upload failed (${response.status})`,
      );
    }
    return data;
  },
};

/* ---------- Admin: Agenda Management (per conference) ---------- */

export type AgendaPayload = {
  session_name: string;
  presenter: string;
  session_date: string; // YYYY-MM-DD (must be today or later when creating)
  duration: string; // free text, e.g. "60 min"
  place: string;
  room: string;
};

export const agendaApi = {
  list: (token: string, conferenceId: number) =>
    apiRequest<AgendaItem[]>(`/admin/conferences/${conferenceId}/agendas`, {
      token,
    }),

  create: (token: string, conferenceId: number, payload: AgendaPayload) =>
    apiRequest<AgendaItem>(`/admin/conferences/${conferenceId}/agendas`, {
      method: "POST",
      token,
      body: payload,
    }),

  update: (
    token: string,
    conferenceId: number,
    agendaId: number,
    payload: AgendaPayload,
  ) =>
    apiRequest<AgendaItem>(
      `/admin/conferences/${conferenceId}/agendas/${agendaId}`,
      {
        method: "PUT",
        token,
        body: payload,
      },
    ),

  remove: (token: string, conferenceId: number, agendaId: number) =>
    apiRequest(`/admin/conferences/${conferenceId}/agendas/${agendaId}`, {
      method: "DELETE",
      token,
    }),
};

/* ---------- Admin: Registration Watchlist (approve / reject) ---------- */

export type RegistrationEntry = {
  id: number;
  user: {
    id?: number;
    name?: string;
    email?: string;
    phone?: string;
    linkedin_url?: string;
    company_name?: string;
    designation?: string;
  };
  conference: { id?: number; title?: string };
  ticket_reference?: string;
  ticket_source?: string;
  approval_status: "pending" | "approved" | "rejected";
  approval_remarks?: string | null;
  approved_at?: string | null;
  created_at?: string;
};

export const registrationApi = {
  list: (token: string, status?: string) =>
    apiRequest<RegistrationEntry[]>(
      `/admin/registrations?per_page=100${status ? `&status=${status}` : ""}`,
      { token },
    ),

  updateApproval: (
    token: string,
    registrationId: number,
    approvalStatus: "approved" | "rejected",
    remarks?: string,
  ) =>
    apiRequest(`/admin/registrations/${registrationId}/approval`, {
      method: "PATCH",
      token,
      body: {
        approval_status: approvalStatus,
        approval_remarks: remarks || null,
      },
    }),
};
