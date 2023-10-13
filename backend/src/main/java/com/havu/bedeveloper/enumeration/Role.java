package com.havu.bedeveloper.enumeration;

import static com.havu.bedeveloper.constant.AuthorityConstant.*;

public enum Role {
    ROLE_CUSTOMER(CUSTOMER_AUTHORITY),
    ROLE_ADMIN(ADMIN_AUTHORITY);

    private String[] authority;

    Role(String[] authority) {
        this.authority = authority;
    }

    public String[] getAuthority() {
        return authority;
    }
}
